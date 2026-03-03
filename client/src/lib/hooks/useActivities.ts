import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import agent from "../api/agent";
import { useLocation } from "react-router";
import type { Activity } from "../types";
import { useAccount } from "./useAccount";

export const useActivities = (id?:string) => { //optional prop id, jer za activities ne treba id

    const queryClient = useQueryClient(); //Varijabla koju koristimo za manipulaciju cache-om
const{currentUser} = useAccount(); //uvodimo current usera da se ne bi pristupalo activities ako ga nema
    const location= useLocation();

    const { data: activities, isLoading } = useQuery<Activity[]>({ //usequery kada fetching data
        //u {} pisemo sta cemo da dobijemo , dobijamo data i zovemo ga activities, i dobijamo state ispending
        queryKey: ['activities'],  // Jedinstveni ključ za identifikaciju ovog upita u cache-u
        queryFn: async () => {  
        // Funkcija koja dohvaća podatke sa API-ja
            const response = await agent.get<Activity[]>('/activities') // Šalje GET zahtjev na API endpoint i dobija odgovor kao Activity[]
            return response.data;   // Vraća samo podatke iz odgovora (response.data)
        },
        enabled: !id  && location.pathname ==='/activities'  && !!currentUser, //pristupamo kada nema id (Nije posebna aktivnosti) , i kada imamo ulogovanog usera 
        
        select: data => {
            return data.map(activity => { //Prolazi kroz svaku aktivnost iz liste
                return {
                    ...activity, //Kopira sva postojeća polja aktivnosti
                     isHost: currentUser?.id === activity.hostId ,  //Proverava da li je trenutni korisnik domaćin aktivnosti Vraća true/false za prikaz dugmadi "Edit/Delete" samo hostu
                    isGoing: activity.attendees.some(x => x.id === currentUser?.id) //Proverava da li je korisnik među učesnicima
                }
            })
        }  
        
    });

        const {isLoading: isLoadingActivity, data: activity } = useQuery<Activity>({   //Za samo jednu activity 
        queryKey: ['activities', id],
        queryFn: async () => {
            const response = await agent.get<Activity>(`/activities/${id}`);
            return response.data;
        },
        //usequery ce se pokrenuti svaki put kada se pokrene useActivities
        enabled: !!id && !!currentUser , // !!id je bolean, i true tj ako imamoo id tada se ovo izvrsava
         select: data => {
            return {
                ...data,
                isHost: currentUser?.id === data.hostId,
                isGoing: data.attendees.some(x => x.id === currentUser?.id)
            }
        }
    });


    const updateActivity = useMutation({ // useMutation kada MODIFIKUJEMO podatke (POST, PUT, DELETE), updateActivity je metod
         // mutationFn - funkcija koja izvršava API poziv za izmenu podataka
        mutationFn: async (activity: Activity) => {  // activity: Activity - parametar koji prima funkcija (Activity objekat koji želimo da ažuriramo)
            await agent.put('/activities/${activity.id}', activity);    // Šalje PUT zahtjev na API endpoint '/activities', PUT metoda se koristi za ažuriranje postojećih podataka
        },
        onSuccess: async () => {  // onSuccess - callback funkcija koja se izvršava NAKON uspješne mutacije
            await queryClient.invalidateQueries({  // briše cache za određeni query, Ovo će automatski triggerovati ponovno učitavanje podataka
                queryKey: ['activities']  //Brišemo cache za query sa ključem ['activities']
            })
        }
    });

       const createActivity = useMutation({
        mutationFn: async (activity: Activity) => {
            const response = await agent.post('/activities', activity); //post request za kreiranje
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['activities'] // Osveži listu nakon kreiranja
            })
        }
    });

     const deleteActivity = useMutation({
        mutationFn: async (id: string) => { // Prima SAMO ID (ne ceo objekat)
            await agent.delete(`/activities/${id}`); // DELETE = brisanje aktivnosti i ne vraca nista
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['activities']
            })
        }
    });

    const updateAttendance = useMutation({
        mutationFn: async (id: string) => {
            await agent.post(`/activities/${id}/attend`);
        },
        // onSuccess: async () => {         
        //     await queryClient.invalidateQueries({
        //         queryKey: ['activities', id]
        //     })

        //ovo je radilo ali zbog sporog ucitavanja radimo drugacije da kada kliknemo npc cancel attendance, da se nasa ikona odmah ukloni
        //OPTIMISTIC UPDATING
        onMutate: async (activityId: string) => {
            await queryClient.cancelQueries({ queryKey: ['activities', activityId] }); // Otkaži sve trenutne fetch-ove za ovu aktivnost

            const prevActivity = queryClient.getQueryData<Activity>(['activities', activityId]); // Sačuvaj trenutno stanje iz cache-a (za rollback)

            queryClient.setQueryData<Activity>(['activities', activityId], oldActivity => {  //pravimo oldActivity
                if (!oldActivity || !currentUser) {  //nista ne radimo ako nemamo usera ili activity
                    return oldActivity; 
                }

                const isHost = oldActivity.hostId === currentUser.id;  
                const isAttending = oldActivity.attendees.some(x => x.id === currentUser.id);

                return {
                    ...oldActivity,//vracamo starua ctivity
                    isCancelled: isHost ? !oldActivity.isCancelled : oldActivity.isCancelled, // Ako je host → promijeni cancel status
                    attendees: isAttending //provjeravamo da li je attending
                        ? isHost   //i da li je i host
                            ? oldActivity.attendees  //ako je host nista ne radimo 
                            : oldActivity.attendees.filter(x => x.id !== currentUser.id) //ako nije host a jeste attending micemo ga sa spiska
                        : [...oldActivity.attendees, {  //dodajmo novog attendee u listu posto nijesmo vec attendee
                            id: currentUser.id, //pravimo novog attendee
                            displayName: currentUser.displayName,
                            imageUrl: currentUser.imageURL,
                        }],
                };
            });

            return { prevActivity }; //Vrati prethodno stanje da ga iskoristis ako se desi greska
        },
        onError: (error, activityId, context) => {
            console.error('Error updating attendance:', error);

            if (context?.prevActivity) {  // Vrati staro stanje iz context-a ako je došlo do greške
                queryClient.setQueryData(['activities', activityId], context.prevActivity);
            }
        } 
})



    return {
        activities,
        isLoading,
        updateActivity,
        createActivity,
        deleteActivity,
        activity,
        isLoadingActivity,
        updateAttendance
    }



}
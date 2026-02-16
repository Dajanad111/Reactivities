import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import agent from "../api/agent";
import { useLocation } from "react-router";

export const useActivities = (id?:string) => { //optional prop id, jer za activities ne treba id

    const queryClient = useQueryClient(); //Varijabla koju koristimo za manipulaciju cache-om

    const location= useLocation();

    const { data: activities, isPending } = useQuery<Activity[]>({ //usequery kada fetching data
        //u {} pisemo sta cemo da dobijemo , dobijamo data i zovemo ga activities, i dobijamo state ispending
        queryKey: ['activities'],  // Jedinstveni ključ za identifikaciju ovog upita u cache-u, [] jer je array
        queryFn: async () => {  
        // Funkcija koja dohvaća podatke sa API-ja
            const response = await agent.get<Activity[]>('/activities') // Šalje GET zahtjev na API endpoint i dobija odgovor kao Activity[]
            return response.data;   // Vraća samo podatke iz odgovora (response.data)
        },
        enabled: !id  && location.pathname ==='/activities' // za pokazivanje loadinga
    });

        const {isLoading: isLoadingActivity, data: activity } = useQuery<Activity>({   //Za samo jednu activity 
        queryKey: ['activities', id],
        queryFn: async () => {
            const response = await agent.get<Activity>(`/activities/${id}`);
            return response.data;
        },
        //usequery ce se pokrenuti svaki put kada se pokrene useActivities
        enabled: !!id // !!id je bolean, i true je ako unesemo id i tada se ovo izvrsava
    });


    const updateActivity = useMutation({ // useMutation kada MODIFIKUJEMO podatke (POST, PUT, DELETE), updateActivity je metod
         // mutationFn - funkcija koja izvršava API poziv za izmenu podataka
        mutationFn: async (activity: Activity) => {  // activity: Activity - parametar koji prima funkcija (Activity objekat koji želimo da ažuriramo)
            await agent.put('/activities', activity);    // Šalje PUT zahtjev na API endpoint '/activities', PUT metoda se koristi za ažuriranje postojećih podataka
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


    return {
        activities,
        isPending,
        updateActivity,
        createActivity,
        deleteActivity,
        activity,
        isLoadingActivity
    }



}
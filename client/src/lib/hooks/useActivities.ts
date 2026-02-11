import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import agent from "../api/agent";

export const useActivities = () => {

    const queryClient = useQueryClient(); //Varijabla koju koristimo za manipulaciju cache-om


    const { data: activities, isPending } = useQuery({ //usequery kada fetching data,// Dohvaća podatke o aktivnostima i status učitavanja
        queryKey: ['activities'],  // Jedinstveni ključ za identifikaciju ovog upita u cache-u
        queryFn: async () => {  // Funkcija koja dohvaća podatke sa API-ja
            const response = await agent.get<Activity[]>('/activities') // Šalje GET zahtjev na API endpoint i tipizira odgovor kao Activity[]
            return response.data;   // Vraća samo podatke iz odgovora (response.data)
        }
    });


    const updateActivity = useMutation({ //usemMutation kada update date
        mutationFn: async (activity: Activity) => {
            await agent.put('/activities', activity);  //  PUT zahtjev na API
        },
        onSuccess: async () => { //Ovo je funkcija koja se pokreće NAKON što je mutacija uspješna
            await queryClient.invalidateQueries({ // await: Čekamo dok se invalidateQueries ne završi prije nego što nastavimo // queryClient: Instanca React Query klijenta koja upravlja svim upitima i cache-om // invalidateQueries: Metoda koja označava određene upite kao "zastarjele" i pokreće njihovo ponovno dohvaćanje
                queryKey: ['activities'] // queryKey: Niz koji identificira koji upiti trebaju biti invalidirani// ['activities']: Ključ koji odgovara useQuery(['activities']) upitu // Ovo znači: "Pronađi sve upite sa ključem 'activities' i osvježi ih"
            })
        }
    });

       const createActivity = useMutation({
        mutationFn: async (activity: Activity) => {
            const response = await agent.post('/activities', activity); //post request
            console.log(response);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['activities']
            })
        }
    });

     const deleteActivity = useMutation({
        mutationFn: async (id: string) => {
            await agent.delete(`/activities/${id}`);
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
        deleteActivity

    }



}
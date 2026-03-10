import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent.ts";
import { useMemo } from "react";
import type { Photo, Profile, User } from "../types/index";

export const useProfile = (id?: string) => {
    const queryClient = useQueryClient();

    const { data: profile, isLoading: loadingProfile } = useQuery<Profile>({
        queryKey: ['profile', id],
        queryFn: async () => { //Async funkcija koja izvršava API poziv
            const response = await agent.get<Profile>(`/profiles/${id}`); // [HttpGet("{userId}")]  PROFILECONTROLLER
            return response.data
        },
        enabled: !!id
    });

    const {data: photos, isLoading: loadingPhotos} = useQuery<Photo[]>({
        queryKey: ['photos', id],
        queryFn: async () => {
            const response = await agent.get<Photo[]>(`/profiles/${id}/photos`);  //  [HttpGet("{userId}/photos")]
            return response.data
        },
        enabled: !!id
    });

    const uploadPhoto = useMutation({ //useMutation - za slanje podataka
        mutationFn: async (file: Blob) => {
            const formData = new FormData();    // pravimo fajl za slanje slike 
            formData.append('file', file);   //  Dodajemo sliku u paket
            const response = await agent.post('/profiles/add-photo', formData, {
                headers: {'Content-type': 'multipart/form-data'}
            });
            return response.data; //  Vraćamo odgovor od servera
        }, 
        onSuccess: async (photo: Photo) => {  //  Šta se desi posle uspešnog uploada
            await queryClient.invalidateQueries({   //  Osveži listu svih slika (ponovo pozovi API)
                queryKey: ['photos', id]
            });
            queryClient.setQueryData(['user'], (data: User) => {    //Ažuriraj ulogovanog korisnika u kešu (bez API poziva)
                if (!data) return data;
                return {
                    ...data,
                    imageUrl: data.imageUrl ?? photo.url //  Postavi sliku ako nema postojeću
                }
            });
            queryClient.setQueryData(['profile', id], (data: Profile) => { // Ažuriraj profil u kešu (bez API poziva)
                if (!data) return data;
                return {
                    ...data,
                    imageUrl: data.imageUrl ?? photo.url //  Postavi sliku ako nema postojeću
                }
            });
        }
    });

    const setMainPhoto = useMutation({
        mutationFn: async (photo: Photo) => {
            await agent.put(`/profiles/${photo.id}/setMain`, {}); //  PUT zahtev iz profilecontroller
        // photo.id = koja slika postaje glavna
        },
        onSuccess: (_, photo) => {   // Šta se desi posle uspešne promene
            queryClient.setQueryData(['user'], (userData: User) => { //  Ažuriraj ulogovanog korisnika u kešu
                if (!userData) return userData;//  Ako nema user-a, ne radi ništa
                return {
                    ...userData, //vrati sve prethodne info o useru 
                    imageUrl: photo.url // Postavi novu glavnu sliku
                }
            });
            queryClient.setQueryData(['profile', id], (profile: Profile) => {  // Ažuriraj profil u kešu
                if (!profile) return profile;
                return {
                    ...profile,
                    imageUrl: photo.url
                }
            });
        }
    });

    const deletePhoto = useMutation({
        mutationFn: async (photoId: string) => {
            await agent.delete(`/profiles/${photoId}/photos`); //  DELETE zahtev - kaže serveru "obriši ovu sliku"
        // photoId = koja slika se briše
        },
        onSuccess: (_, photoId) => {   //  Šta se desi posle uspešnog brisanja
            queryClient.setQueryData(['photos', id], (photos: Photo[]) => {  // Ažuriraj listu slika u kešu (bez ponovnog API poziva)
                return photos?.filter(p => p.id !== photoId);   // Filter: "Zadrži sve slike OSIM one koju smo obrisali"
            });
        }
    })

    //provjeravamo da li je trenutni profil moj profil
    const isCurrentUser = useMemo(() => {  
      return id === queryClient.getQueryData<User>(['user'])?.id //je li id sa urla(profila koji gledas) isti kao id usera koji je ulogovan 
      //['user'] jer smo tako napisali u useAccount da se dobija
    }, [id, queryClient]) //Ponovo izračunaj da li je ovo moj profil SAMO ako se nešto od ovoga promijeni

    return {
        profile,
        loadingProfile,
        photos,
        loadingPhotos,
        isCurrentUser,
        uploadPhoto,
        setMainPhoto,
        deletePhoto
    }
}
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent.ts";
import { useMemo, useState } from "react";
import type { Activity, Photo, Profile, User } from "../types/index";
import type { EditProfileSchema } from "../schemas/editProfileSchema.ts";

export const useProfile = (id?: string, predicate?: string) => {
    const queryClient = useQueryClient();
      const [filter, setFilter] = useState<string | null>(null) //uvodimo filer za prikaz aktivnosti, default vrijednost null

    const { data: profile, isLoading: loadingProfile } = useQuery<Profile>({
        queryKey: ['profile', id],
        queryFn: async () => { //Async funkcija koja izvršava API poziv
            const response = await agent.get<Profile>(`/profiles/${id}`); // [HttpGet("{userId}")]  PROFILECONTROLLER
            return response.data
        },
        enabled: !!id && !predicate  //izvrsava se kad imamo id a nemamo predicate
    });

    const {data: photos, isLoading: loadingPhotos} = useQuery<Photo[]>({
        queryKey: ['photos', id],
        queryFn: async () => {
            const response = await agent.get<Photo[]>(`/profiles/${id}/photos`);  //  [HttpGet("{userId}/photos")]
            return response.data
        },
        enabled: !!id && !predicate
    });

    
    const {data: followings, isLoading: loadingFollowings} = useQuery<Profile[]>({
        queryKey: ['followings', id, predicate],
        queryFn: async () => {
            const response = await agent.get<Profile[]>(`/profiles/${id}/follow-list?predicate=${predicate}`); //prosledjujemo i predicate
            return response.data
        },
        enabled: !!id && !!predicate
    })

      const {data: userActivities, isLoading: loadingUserActivities} = useQuery({
        queryKey: ['user-activities', filter], //znači da React Query automatski refreshuje podatke kad se filter promijeni
        // /'user-activities' je  Ime/naziv ovog upita , a filter je promjenljiva vrijednost
        queryFn: async () => {
            const response = await agent.get<Activity[]>(`/profiles/${id}/activities`, {  //mora da se poklopi sa backendom  [HttpGet("{userId}/activities")]
                params: { //prosledjujemo filter, na drugaciji nacin nego sto smo gore predicate
                    filter   
                }
            });
            return response.data
        },
        enabled: !!id && !!filter // Bez ovoga: Upit bi se izvršio čim se komponenta učita → greška jer nema filtera
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
 


  const updateProfile = useMutation({  // Funkcija koja se izvršava kada pozovemo updateProfile
        mutationFn: async (profile: EditProfileSchema) => {  
            await agent.put(`/profiles`, profile); // Šaljemo podatke na server koristeći PUT metodu
        }, // '/profiles' je adresa na backendu (gde smo pisali C# kod)  [HttpPut]  u kontroleru 
        onSuccess: (_, profile) => {
            queryClient.setQueryData(['profile', id], (data: Profile) => {
                if (!data) return data;
                return {
                    ...data,     // Vrati stare podatke, ali ažuriraj ime i bio novim vrednostima
                    displayName: profile.displayName,
                    bio: profile.bio
                }
            });
            queryClient.setQueryData(['user'], (userData: User) => {
                if (!userData) return userData;
                return {
                    ...userData,
                    displayName: profile.displayName
                }
            });
        }
       
    });

     const updateFollowing = useMutation({
        mutationFn: async () => {
            await agent.post(`/profiles/${id}/follow`)  //id je sa vrha   useProfile = (id?: string)
        },
        onSuccess: () => {
            queryClient.setQueryData(['profile', id], (profile: Profile) => {
                queryClient.invalidateQueries({queryKey: ['followings', id, 'followers']});
                if (!profile || profile.followersCount === undefined) return profile;
                return {
                    ...profile,
                    following: !profile.following,
                    followersCount: profile.following 
                        ? profile.followersCount - 1 
                        : profile.followersCount + 1
                }
            })
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
        deletePhoto,
        updateProfile,
        updateFollowing,
        followings,
        loadingFollowings,
         userActivities,
        loadingUserActivities,
        setFilter,
        filter
    }
}
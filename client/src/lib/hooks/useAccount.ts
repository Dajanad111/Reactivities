
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import type { LoginSchema } from "../schemas/loginSchema";
import type { User } from "../types";
import { useNavigate } from "react-router";
import type { RegisterSchema } from "../schemas/registerSchema";
import { toast } from "react-toastify";

//Ovaj "custom hook" sadrži svu logiku za komunikaciju sa serverom.
// loginUser je mutacija jer menjamo stanje na serveru (pravimo sesiju), 
//dok je currentUser upit (query) jer samo čitamo podatke o ulogovanom korisniku.


export const useAccount = () => {
    const queryClient = useQueryClient(); // Pristupamo cache-u React Query-ja da bismo ažurirali podatke

    const navigate = useNavigate();  // Inicijalizujemo navigaciju za preusmeravanje korisnika

     // Mutacija se koristi kada šaljemo podatke (POST, PUT, DELETE)
    const loginUser = useMutation({
        mutationFn: async (creds: LoginSchema) => { // mutationFn je funkcija koja se izvršava kada pozovemo loginUser.mutate()
            await agent.post('/login?useCookies=true', creds);   // Šaljemo POST zahtev na endpoint '/login' sa kredencijalima iz loginscheme
             // '?useCookies=true' govori serveru da koristi cookies za sesiju
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['user'] //Brišemo cache za query sa ključem ['user']
            });
           
        }

    });
    
    const registerUser = useMutation({
        mutationFn: async (creds: RegisterSchema) => {
            await agent.post('/account/register', creds);         // Šaljemo POST zahtev na endpoint '/account/register' sa podacima iz forme
        // Server će kreirati novog korisnika u bazi i vratiti odgovor
        },
        onSuccess: async () => {    // onSuccess se izvršava AKO je server vratio 200/201 (uspešno kreiran nalog)
            toast.success('Register successful - you can now login');  // Prikazujemo korisniku obaveštenje da je registracija uspešna
            navigate('/login');
        }
    })

    const logoutUser = useMutation({
        mutationFn: async () => {
            await agent.post('/account/logout');
        },
        onSuccess: () => {
            queryClient.removeQueries({queryKey: ['user']}); //mice ucitanog usera
             queryClient.removeQueries({queryKey: ['activities']}); //ukloni ucitane aktivnosti nakon sto se izlogujes
            navigate('/');  //predji na pocetnu stranu
        }
    })

     const {data: currentUser, isLoading: loadingUserInfo } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await agent.get<User>('/account/user-info');
            return response.data;
        },
          enabled: !queryClient.getQueryData(['user'])
        
    });

    return {
        loginUser,
        currentUser,
        logoutUser,
        loadingUserInfo,
        registerUser
    }
}

import axios from 'axios';
import { store } from '../stores/store';
import { toast } from 'react-toastify';
import { router } from '../../app/router/Routes';

//Kreira funkciju koja čeka određeni broj milisekundi
const sleep = (delay: number) => { //delay: number - parametar koji određuje koliko milisekundi da čeka
    return new Promise((resolve) => { //kreira Promise koji će se izvršiti nakon određenog vremena
        setTimeout(resolve, delay); //JavaScript funkcija koja čeka delay milisekundi, pa zatim poziva resolve funkciju
    });
}

const agent = axios.create({ //kreira novu axios instancu sa podešenim konfiguracijama
    baseURL: import.meta.env.VITE_API_URL //postavlja osnovni URL za sve API pozive iz .env.developmenta
});
agent.interceptors.request.use(config => {//  Pokaži loading spinner (korisnik vidi da se nešto dešava)
    store.uiStore.isBusy(); 
    return config;
})

// dodaje interceptor koji hvata sve odgovore od servera 
agent.interceptors.response.use( //async response => - asinhrona funkcija koja prima odgovor od servera
    async response => { //async response => - asinhrona funkcija koja prima odgovor od servera    //USPEŠAN ODGOVOR (200-299 status kodovi)
        await sleep(1000); //čeka 1 sekundu (1000 milisekundi) pre nego što prosledi odgovor dalje
        store.uiStore.isIdle()  // Sakrij loading spinner
        return response; //vraća originalni odgovor nakon kašnjenja
    },
   
    async error => { // GREŠKA (400, 404, 500... status kodovi)
        await sleep(1000); 
        store.uiStore.isIdle(); 
        const { status,data } = error.response; // Izvuci podatke iz greške
        switch (status) {    //  Reagiraj različito za različite status kodove
            case 400: // Bad Request (validacione greške)
                 if (data.errors) {  // Greške su po poljima: { title: ["Title is required"] }
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat(); //  Baci sve greške kao niz da ih frontend prikaže
            } else {
                toast.error(data);   //  Jednostavna poruka o grešci
            }
                
                break;
            case 401:
                toast.error('unauthorised');
                break;

            case 404:
                router.navigate('/not-found')
                break;
            case 500: // Server Error (nešto je puklo na serveru)
                //  Redirektuj na error stranicu SA DETALJIMA GREŠKE
               router.navigate('/server-error', {state: {error:data}})
                break;
            default:
                break;

        }

        return Promise.reject(error);
    }
);

export default agent;
import {useEffect, useRef} from 'react';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { useLocalObservable } from "mobx-react-lite";
import { runInAction } from 'mobx';
import type { ChatComment } from '../types';

export const useComments = (activityId?: string) => {
    const created = useRef(false);  //Da zapamtimo da li smo već kreirali konekciju (sprečava dupliranje)

    const commentStore = useLocalObservable(() => ({ //Da napravimo lokalni "store" sa reakтивnim stanjem MOBX
        //Čim se promeni nešto unutra (npr. stigne novi komentar), svi delovi ekrana koji koriste commentStore se automatski ažuriraju.

        comments: [] as ChatComment[], // lista komentara, prazna na pocetku 
        hubConnection: null as HubConnection | null, // Tu ćemo smestiti samu SignalR vezu kada je napravimo.

        createHubConnection(activityId: string) { //Povezivanje na SignalR
            if (!activityId) return; // Ako nema ID-a, ne radimo ništa.

            this.hubConnection = new HubConnectionBuilder()// Metoda za pravljenje veze 
                .withUrl(`${import.meta.env.VITE_COMMENT_URL}?activityId=${activityId}`, { //Uzima adresu iz podešavanja,ulazi u dio gdje je ovaj id 
                    withCredentials: true //Šaljemo i kolačiće (cookies) da bi server znao ko si ti (da li si ulogovan).
                })
                .withAutomaticReconnect() //Ako internet zatreperi, SignalR će sam pokušati ponovo da se poveže.
                .build(); //veza je napravljena i smeštena u this.hubConnection.

            this.hubConnection.start().catch(error => console.log('Error establishing connection: ', error)); //pokretanje veze. ako ne uspije ispisuje gresku 

            this.hubConnection.on('LoadComments', comments => { // Kada se prvi put povežeš, server pošalje svu istoriju komentara.
                // 'LoadComments' (ovo ime mora biti isto kao u CommentHub-u
                runInAction(() => {   //mijenjanje podataka MOBX i refresh ekrana
                    this.comments = comments //postaje lista svih starih komentara.
                })
            });

            this.hubConnection.on('ReceiveComment', comment => { //Kada neko novi napiše komentar, server pošalje samo taj jedan.
                runInAction(() => {
                    this.comments.unshift(comment) //unshift dodaje element na početak niza. Tako najnoviji komentar uvek bude prvi na vrhu liste.
                })
            })
        },

        stopHubConnection() {
            if (this.hubConnection?.state === HubConnectionState.Connected) { //Da proverimo da li je konekcija aktivna pre gašenja signalr
                this.hubConnection.stop().catch(error => console.log('Error stopping connection: ', error)); //Ako jeste, zove stop() da uredno ugasi vezu i oslobodi resurse.
            } 
        },
    }));

    useEffect(() => { //Da izvršimo kod kada se komponenta učita ili promeni activityId REACT HOOK
        if (activityId && !created.current) { //ako imamo activityId I created.current je i dalje false
            commentStore.createHubConnection(activityId); //Pozivamo createHubConnection (metodu iz tačke 16) 
            created.current = true; //postavljamo created.current = true.
        }

        return () => { //Ova funkcija se izvršava tačno u trenutku kada korisnik napusti stranicu ili se komponenta ukloni.
            commentStore.stopHubConnection(); // Gasimo SignalR vezu da ne bi "visila" u pozadini i trošila memoriju.
            commentStore.comments = []; //Brišemo stare komentare iz memorije da, kada korisnik ode na drugu aktivnost, ne bi video komentare odavde.
        };
    }, [activityId, commentStore]); //Kažemo React-u: "Pokreni ovaj efekat ponovo samo ako se promeni activityId ili commentStore".

    return {
        commentStore
    };
    //Hook vraća objekat koji sadrži naš commentStore.
// To znači da u tvojoj komponenti sada imaš pristup svemu:
// commentStore.comments (lista za prikaz)
// commentStore.createHubConnection (ako ikad treba ručno da povežeš)
// commentStore.stopHubConnection (ako treba ručno da prekineš)
};
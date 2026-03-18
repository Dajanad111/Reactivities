import { makeAutoObservable } from "mobx";

export class ActivityStore {
    filter = 'all'; //pamti trenutni odabir filtera, default je all 
    startDate = new Date().toISOString() //Početni datum. Po defaultu je trenutni datum i vrijeme.

    constructor() {
        makeAutoObservable(this); //MobX, prati ovaj objekt. Kad god se filter ili startDate promijene
        // automatski osvježi sve dijelove ekrana koji koriste te podatke
    }
//Kako se mijenja? (Funkcije)
    setFilter = (filter: string) => { // Funkcija kojom vanjski svijet (npr. gumb na ekranu) može promijeniti vrijednost filtra.
        this.filter = filter;
    }

    setStartDate = (date: Date) => { //Funkcija kojom se mijenja datum (i pretvara ga u tekst format koji računalo lakše sprema).
        this.startDate = date.toISOString();
    }
}
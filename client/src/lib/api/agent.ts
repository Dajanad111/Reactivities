import axios from 'axios';

//Kreira funkciju koja čeka određeni broj milisekundi
const sleep = (delay: number) => { //delay: number - parametar koji određuje koliko milisekundi da čeka
    return new Promise((resolve) => { //kreira Promise koji će se izvršiti nakon određenog vremena
        setTimeout(resolve, delay); //JavaScript funkcija koja čeka delay milisekundi, pa zatim poziva resolve funkciju
    });
}

const agent = axios.create({ //kreira novu axios instancu sa podešenim konfiguracijama
    baseURL: import.meta.env.VITE_API_URL //postavlja osnovni URL za sve API pozive iz .env.developmenta
});

 // dodaje interceptor koji hvata sve odgovore od servera 
 agent.interceptors.response.use(async response => { //async response => - asinhrona funkcija koja prima odgovor od servera
    try {
        await sleep(1000); //čeka 1 sekundu (1000 milisekundi) pre nego što prosledi odgovor dalje
        return response; //vraća originalni odgovor nakon kašnjenja
    } catch (error) { //hvata eventualne greške tokom čekanja
        console.log(error); //loguje grešku u konzolu
        return Promise.reject(error); //odbacuje Promise sa greškom . Promise moze biti resolve i reject
    }
});

export default agent;
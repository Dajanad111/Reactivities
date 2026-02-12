
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import type { FormEvent } from "react";
import { useActivities } from "../../../../lib/hooks/useActivities";
import { useNavigate, useParams } from "react-router";


export default function ActivityForm() {
    const {id}=useParams(); //  React Router hook koji izvlači parametre iz URL-a
    const {updateActivity, createActivity, activity, isLoadingActivity} = useActivities(id); //dodamo hooks iz useActivities
    const navigate = useNavigate();  //za prelazak na drugu stranicu

//standardna praksa submita forme i formdata
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {  //react event za submiting forme
        event.preventDefault(); //SPREČAVA default ponašanje forme (refresh stranice)
        const formData = new FormData(event.currentTarget);  //Formdata je js class,FormData je specijalan objekat, a mi ga konvertujemo u običan JavaScript objekat
         // Kreiramo PRAZAN data objekat za čuvanje podataka
        const data: { [key: string]: FormDataEntryValue } = {}  // key je name iz polja forme (npr. 'title', 'description') , ali vrednost mora biti FormDataEntryValue(string, File, ili null)
        formData.forEach((value, key) => {  //Prolazimo kroz SVAKI par (ključ, vrednost) u FormData , value = vrijdnost polja (npr. 'Activity 5'),  key = name atribut polja (npr. 'title')
            data[key] = value; //  Dodajemo par (ključ, vrednost) u naš objekat
        });
    

       if (activity) { // AKO POSTOJI aktivnost → RADIMO UPDATE (ažuriranje)
            data.id = activity.id; //  Dodajemo ID u podatke jer server mora znati KOJU aktivnost ažuriramo
            await updateActivity.mutateAsync(data as unknown as Activity);  //poziva useMutation hook iz useActivities
            //mutateAsync Pokreće ažuriranje i čeka rezultat
              navigate(`/activities/${activity.id}`) // Preusmerava korisnika na stranicu ažurirane aktivnosti
            
        } else { // AKO NE POSTOJI aktivnost → RADIMO CREATE (kreiranje nove)
         createActivity.mutate(data as unknown as Activity, {  //data' je tipa { [key: string]: FormDataEntryValue }  Ali naša mutacija očekuje tip 'Activity'
            onSuccess: (id)=> {  // callback koji se poziva NAKON uspešnog kreiranja,  server vraća ID nove aktivnosti (ako je implementirano)
                navigate(`/activities/${id}`)  // Preusmjerava na stranicu NOVE aktivnosti
            }
         });
           
        }

    }
      if (isLoadingActivity) return <Typography>Loading activity...</Typography>;

    return (
        <Paper sx={{ borderRadius: 3, padding: 3 }}>  
            <Typography variant="h5" gutterBottom color="primary"> 
                 {activity ? 'Edit Activity' : 'Create Activity'} </Typography> 
            <Box component='form' onSubmit={handleSubmit} display='flex' flexDirection={"column"} gap={3}>
                <TextField name='title' label='Title' defaultValue={activity?.title} />
                <TextField name='description' label='Description' defaultValue={activity?.description} multiline rows={3} />
                <TextField name='category' label='Category' defaultValue={activity?.category} />
                <TextField name='date' label='Date' type="date"
                 defaultValue={activity?.date  ? new Date(activity.date).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0]} 
                 />
                <TextField name='city' label='City' defaultValue={activity?.city} />
                <TextField name='venue' label='Venue' defaultValue={activity?.venue} />
                <Box display='flex' justifyContent='end' gap='3'>
                    <Button onClick={() => navigate('/activities')}  color='inherit'>Cancel</Button>
                    <Button 
                    type="submit"
                     color='success' 
                     variant="contained"
                     disabled= {updateActivity.isPending || createActivity.isPending} //da ne moze da se klikne dok se updatuje 
                     >Submit</Button>
                </Box>
            </Box>
        </Paper>
    )
}

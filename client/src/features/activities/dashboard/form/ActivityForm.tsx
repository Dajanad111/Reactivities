
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import type { FormEvent } from "react";
import { useActivities } from "../../../../lib/hooks/useActivities";

type Props = {
    activity?: Activity
    closeForm: () => void;
    
}

export default function ActivityForm({ activity, closeForm }: Props) {
    const {updateActivity, createActivity} = useActivities(); //dodamo hooks iz useActivities

//standardna praksa submita forme i formdata
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {  //react event za submiting forme
        event.preventDefault(); //preventuje npr reload
        const formData = new FormData(event.currentTarget);  //Formdata je js class,FormData je specijalan objekat, a mi ga konvertujemo u običan JavaScript objekat
        const data: { [key: string]: FormDataEntryValue } = {}  // key je name iz polja forme , ali vrednost mora biti FormDataEntryValue
        formData.forEach((value, key) => {  //Prolazi kroz sve form podatke i dodaje ih u objekat
            data[key] = value;
        });

       if (activity) {
            data.id = activity.id;
            await updateActivity.mutateAsync(data as unknown as Activity); 
            //poziva useMutation hook iz useActivities
            //mutateAsync Pokreće ažuriranje i čeka rezultat
            closeForm();
        } else { //u slucaju da se id ne poklapa znaci da se pravi nova activity
            await createActivity.mutateAsync(data as unknown as Activity);
            closeForm();
        }

    }

    return (
        <Paper sx={{ borderRadius: 3, Padding: 3 }}>  
            <Typography variant="h5" gutterBottom color="primary"> Create activity</Typography>
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
                    <Button onClick={closeForm} color='inherit'>Cancel</Button>
                    <Button 
                    type="submit"
                     color='success' 
                     variant="contained"
                     disabled= {updateActivity.isPending || createActivity.isPending}
                     >Submit</Button>
                </Box>
            </Box>
        </Paper>
    )
}

import { Box, Button, Paper, Typography } from "@mui/material";
import { useActivities } from "../../../../lib/hooks/useActivities";
import { useNavigate, useParams } from "react-router";
import { useForm } from 'react-hook-form';
import { useEffect } from "react";
import { activitySchema, type ActivitySchema } from "../../../../lib/schemas/activitySchema";
import { zodResolver } from '@hookform/resolvers/zod'
import TextInput from "../../../../app/shared/components/TextInput";
import SelectInput from "../../../../app/shared/components/SelectInput";
import { categoryOptions } from "./categoryOptions";
import DateTimeInput from "../../../../app/shared/components/DateTimeInput";
import LocationInput from "../../../../app/shared/components/LocationInput";
import type { Activity } from "../../../../lib/types";

export default function ActivityForm() {

    const { control, reset, handleSubmit } = useForm<ActivitySchema>({//metode iz reack hooka
        mode: 'onTouched', //da polje pocrveni cim ga taknes ako ostane prazno
        resolver: zodResolver(activitySchema) //povezujemo Zod schema da automatski validira podatke prema pravilima iz activitySchema
    });
    const { id } = useParams(); //  React Router hook koji izvlači parametre iz URL-a (npr. /activity/123 → id = "123")
       const navigate = useNavigate();
    const { updateActivity, createActivity, activity, isLoadingActivity } = useActivities(id); //dodamo hooks iz useActivities

    useEffect(() => { // Kada stignu podaci o aktivnosti (pri editovanju), popuni formu
        if (activity) reset({  //kad dobijemo activity reset je pretvara u objekat za activityschema
            ...activity,
            location: {
                city: activity.city,
                venue: activity.venue,
                latitude: activity.latitude,
                longitude: activity.longitude
            }
        }); 
    }, [activity, reset]); //efekat se pokreće samo kada se promijeni activity ili reset

 const onSubmit = async (data: ActivitySchema) => {
    console.log(data)
        const { location, ...rest } = data;
        const flattenedData = { ...rest, ...location };
        try {
            if (activity) {
               const payload = { 
                id: activity.id,  
                ...flattenedData 
            } as Activity;     
            updateActivity.mutate(payload, {
                onSuccess: () => navigate(`/activities/${activity.id}`),
                onError: (error) => {
                    console.error('Update failed:', error);
                } });
            } else {
                createActivity.mutate(flattenedData as Activity , {
                    onSuccess: (id) => {
                        navigate(`/activities/${id}`);
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
  
    
    if (isLoadingActivity) return <Typography>Loading activity...</Typography>;

    return (
        <Paper sx={{ borderRadius: 3, padding: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
                {activity ? 'Edit Activity' : 'Create Activity'} </Typography>
            <Box component='form' onSubmit={handleSubmit(onSubmit)} display='flex' flexDirection={"column"} gap={3}>
                <TextInput label='Title' control={control} name='title' />     {/*control: povezuje polje sa react-hook-form logikom*/}
                <TextInput label='Description' control={control} name='description'
                    multiline rows={3} />
                <Box display='flex' gap={3}>
                    <SelectInput items={categoryOptions}
                        label='Category'
                        control={control}
                        name='category' />
                    <DateTimeInput label='Date' control={control} name='date' />
                </Box>

                <LocationInput control={control} label='Enter the location' name='location' />
                <Box display='flex' justifyContent='end' gap='3'>
                    <Button color='inherit'>Cancel</Button>
                    <Button
                        type="submit"
                        color='success'
                        variant="contained"
                        disabled={updateActivity.isPending || createActivity.isPending} //da ne moze da se klikne dok se updatuje 
                    >Submit</Button>
                </Box>
            </Box>
        </Paper>
    )
}

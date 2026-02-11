import { Box, Button, Card, CardActions, CardContent, Chip, Typography } from "@mui/material"
import { useActivities } from "../../../lib/hooks/useActivities";


type Props = {
    activity: Activity  //uzima jednu activity i od nje pravi card
    selectActivity: (id: string) => void;

}

export default function ActivityCard({ activity, selectActivity }: Props) {

    const { deleteActivity } = useActivities();
    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Typography variant="h5">{activity.title}</Typography>
                <Typography sx={{ color: 'text.secondary', marginBottom: 1 }}>{activity.date}</Typography>
                <Typography variant="body2">{activity.description}</Typography>
                <Typography variant="subtitle1">{activity.city}/{activity.venue} </Typography>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', pb: 2 }}>
                <Chip label={activity.category} variant="outlined" />
                <Box display='flex' gap={3}>
                    <Button onClick={() => selectActivity(activity.id)} size="medium" //Arrow funkcija ={() => ...} kreira ovu funkciju koja će se izvršiti tek kada se klikne.
                        variant="contained">View</Button>
                    <Button
                        onClick={() => deleteActivity.mutate(activity.id)}
                        color='error' size="medium"
                        variant="contained"
                        loading={deleteActivity.isPending}>
                        Delete</Button>
                </Box>
            </CardActions>
        </Card>
    )
}

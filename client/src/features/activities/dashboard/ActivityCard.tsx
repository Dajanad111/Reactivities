import { Box, Button, Card, CardActions, CardContent, Chip, Typography } from "@mui/material"
import { useActivities } from "../../../lib/hooks/useActivities";
import { Link } from "react-router";



type Props = {
    activity: Activity  //uzima jednu activity i od nje pravi card
    onPreview: (activity: Activity) => void ;   
}

export default function ActivityCard({ activity, onPreview }: Props) {

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
                    <Button onClick={() => onPreview(activity)} size="medium"   //onPreview(activity)  poziva setSelectedActivity i postavlja selectactivitu na ovu activity
                        variant="contained">Preview</Button>
                    <Button component={Link} to={`/activities/${activity.id}`} size="medium" 
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

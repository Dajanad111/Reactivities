import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material"

import { Link, useNavigate, useParams } from "react-router";
import { useActivities } from "../../../../lib/hooks/useActivities";


export default function ActivityDetail() {
    const navigate = useNavigate();  //usehook iz react routera  
    const {id} = useParams(); //iz routes
    const {activity, isLoadingActivity}= useActivities(id);
    if (isLoadingActivity) return <Typography>Loading...</Typography>
    if (!activity) return <Typography>Activity not found</Typography> 
  return (
    <Card sx={{borderRadius: 3}}>
        <CardMedia  
        component='img'  //dodajemo sliku
        src={`/images/categoryImages/${activity.category}.jpg`}  //svakoj kategoriji ide druga slika 
        />
        <CardContent>
            <Typography variant="h5">{activity.title}</Typography>
            <Typography variant="subtitle1" fontWeight='light'>{activity.date}</Typography>
            <Typography variant="body1">{activity.description}</Typography>
        </CardContent>
        <CardActions>
            <Button component={Link} to={`/manage/${activity.id}`} color="primary">Edit</Button> {/* component je link, manage je iz routes*/}
            <Button onClick={() => navigate('/activities')} color="inherit">Cancel 	{/* drugi nacin*/}
            </Button> 
        </CardActions>
    </Card>
  )
}

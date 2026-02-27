import { Box, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import ActivityCard from "./ActivityCard";




export default function ActivityList() {

   const { activities, isLoading } = useActivities(); 


  if (isLoading) return (<Typography>Loading...</Typography>)
     if (!activities) return (<Typography>No activitities found.</Typography>)
  return (
   
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
        {activities.map(activity => ( //prolazimo kroz svaki element activity  od activities ( korisitmo ( ovu zagradu jer vracamo jednu stvar)
            <ActivityCard  //postavljamo card
             key={activity.id}  //dodajemo joj key
             activity={activity} />
        ))}</Box>
    
  )
}

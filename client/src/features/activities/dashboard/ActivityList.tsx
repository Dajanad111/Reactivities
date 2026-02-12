import { Box, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useState } from "react";
import Preview from "./details/Preview";
import ActivityCard from "./ActivityCard";



export default function ActivityList() {

   const { activities, isPending } = useActivities(); 
   const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null); //pocetno stanje null, moze biti activity ili null

  if (!activities || isPending) return (<Typography>Loading...</Typography>)
  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
        {activities.map(activity => ( //prolazimo kroz svaki element activity  od activities ( korisitmo ( ovu zagradu jer vracamo jednu stvar)
            <ActivityCard  //postavljamo card
             key={activity.id}  //dodajemo joj key
             activity={activity}
             onPreview={setSelectedActivity}  //saljemo onpreview u card da bi mogli kliknuti dugme
             />
        ))}</Box>

      {/* DESNA STRANA - PREVIEW */}
    <Box sx={{ flex: 2,minWidth: 400 }}>
      {selectedActivity && (
        <Preview
          activity={selectedActivity} //saljemo selektovani actvity
          onCancel={() => setSelectedActivity(null)} //funkcija koja se odma izvrsava i postavlja na null
        />
      )}
    </Box>

    </Box>
  )
}

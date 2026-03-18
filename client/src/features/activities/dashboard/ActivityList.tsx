import { Box, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import ActivityCard from "./ActivityCard";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";



const ActivityList =observer( function ActivityList() {  //da bi radili filteri 

   const { activitiesGroup, isLoading, hasNextPage,fetchNextPage } = useActivities(); 
   const {ref, inView} = useInView({
      threshold: 0.5 //kad budemo vidjeli pola trenutne grupe activity onda se vec ucitavaju sledece
   });

   useEffect(()=>{
      if (inView && hasNextPage){
         fetchNextPage();
      }
   }, [inView, hasNextPage,fetchNextPage])

  if (isLoading) return (<Typography>Loading...</Typography>)
     if (!activitiesGroup) return (<Typography>No activitities found.</Typography>)
  return (
   
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
      {activitiesGroup.pages.map((activities, index)=>(
         <Box 
         key= {index}
         ref={index === activitiesGroup.pages.length -1? ref:null } //dodajemo ref samo poslednjoj activity y grupi
         display = 'flex'
         flexDirection='column'
         gap={3}
         >
            {activities.items.map(activity => ( //prolazimo kroz svaki element activity  od activities ( korisitmo ( ovu zagradu jer vracamo jednu stvar)
            <ActivityCard  //postavljamo card
             key={activity.id}  //dodajemo joj key jer je loop
             activity={activity} />
        ))}
         </Box>
      ))}
        </Box>
    
  )
})

export  default ActivityList;

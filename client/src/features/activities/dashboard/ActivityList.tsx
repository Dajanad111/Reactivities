import { Box } from "@mui/material";
import ActivityCard from "./ActivityCard";


type Props = {
      activities: Activity[]; //uzimamo bazu activities (iz dashboarda) da od svakog clana pravimo card 
      selectActivity: (id: string) => void;  //koristi se u card, nasledjuje se iz dasboarda
}

export default function ActivityList({activities, selectActivity}: Props ) {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
        {activities.map(activity => ( //prolazimo kroz svaki element activity  od activities ( korisitmo ( ovu zagradu jer vracamo jednu stvar)
            <ActivityCard  //postavljamo card
             key={activity.id}  //dodajemo joj key
             activity={activity}  //passed down to card
             selectActivity={selectActivity} 
            
             />
        ))}

    </Box>
  )
}

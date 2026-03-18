import { Grid } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityFilters from "./ActivityFilters";


export default function ActivityDashboard() {


  return (
    <Grid container spacing={3}>
      <Grid size={8}>
        <ActivityList />
      </Grid>
       <Grid size={4} sx={{
                position: 'sticky', //da ostaje na ekranu na istoj poziciji kad skrolas
                top: 95,  //koliko da se odvoji od vrha i na kojoj poziciji da uvijek bude
                alignSelf: 'flex-start'  // Ostaje lijevo, čak i ako su drugi elementi drugačije visine
            }}>
       <ActivityFilters />
      </Grid>
    </Grid>
  )
}

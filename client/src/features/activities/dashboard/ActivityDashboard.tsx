import { Grid } from "@mui/material";
import ActivityList from "./ActivityList";

export default function ActivityDashboard() {
  return (
    <Grid container spacing={3}>
      <Grid size={10}>
        <ActivityList />
      </Grid>
      <Grid size={2}>
       Activities filters go here
      </Grid>
    </Grid>
  )
}

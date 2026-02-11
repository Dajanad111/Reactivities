import { Grid } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityDetail from "./details/ActivityDetail";
import ActivityForm from "./form/ActivityForm";

type Props = { //prosledjujes podatke iz roditeljske komponente u dečiju komponentu tj iz app u dashboard
  activities: Activity[]; // iz app saljemo listu activity[], prosledjuje se dalje activitylist
  selectActivity: (id: string) => void; //
  cancelSelectActivity: () => void; //
  selectedActivity: Activity | undefined;
  openForm: (id: string) => void; //
  closeForm: () => void;
  editMode: boolean;

}

export default function ActivityDashboard({
  activities,   
  cancelSelectActivity,
  selectActivity,  
  selectedActivity,
  openForm,
  closeForm,
  editMode,
   }: Props) {  

  return (
    <Grid container spacing={3}>
      <Grid size={7}>
        <ActivityList
          activities={activities}  //passed down to activitylist
          selectActivity={selectActivity} 
        />
      </Grid>
      <Grid size={5}>
        {selectedActivity && !editMode &&
          <ActivityDetail
            selectedActivity={selectedActivity}  //propsi iz
            cancelSelectActivity={cancelSelectActivity}
            openForm={openForm}
          />
        }
        {editMode &&
          <ActivityForm
           activity={selectedActivity}
           closeForm={closeForm}
           
          />}
      </Grid>
    </Grid>
  )
}

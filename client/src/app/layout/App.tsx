
import { Box, Container, CssBaseline, Typography } from "@mui/material";
import { useState } from "react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { useActivities } from "../../lib/hooks/useActivities";

function App() {

  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false); //da sacuvamo da li je form otvorena ili ne

   const {activities, isPending} = useActivities();  


  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities!.find(x => x.id === id));  //pronadji activity (x) u bazi activities, koja ima isti id kao id sto je proslijedjen 
  }

  const handleCancelSelectActivity = () => {  //bez argumenata
    setSelectedActivity(undefined); //postavlja selectedactivity na undefined
  }

  const handleOpenForm = (id?: string) => { //id na treba za editovanje, ne treba za create
    if (id) handleSelectActivity(id); //ako smo ukucali id onda handleSelectActivity
    else handleCancelSelectActivity(); //
    setEditMode(true); //edit mode je true
  }

  const handleFormClose = () => {
    setEditMode(false);
  }


  return (
    <Box sx={{ bgcolor: '#f1ececee', minHeight:'100vh'}}>
      <CssBaseline />  {/* mice liniju ispred navbara*/}
      <NavBar
        openForm={handleOpenForm} />
      <Container maxWidth='xl' sx={{ margin: 3 }} >
        {!activities || isPending ? (<Typography>Loading...</Typography>) : (
          <ActivityDashboard
            activities={activities}   //activities iz dashboarda (ovo je properti koji saljemo dashbordu) == activities iz use state definicije u app
            selectActivity={handleSelectActivity} //svi props koje saljemo dalje dashbordu
            cancelSelectActivity={handleCancelSelectActivity} //svi props koje saljemo dalje dashbordu ....
            selectedActivity={selectedActivity}
            editMode={editMode}
            openForm={handleOpenForm}
            closeForm={handleFormClose}
          />


        )}

      </Container>
    </Box>

  )
}

export default App

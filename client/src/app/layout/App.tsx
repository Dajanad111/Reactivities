
import { Box, Container, CssBaseline } from "@mui/material";
import NavBar from "./NavBar";

import { Outlet, useLocation } from "react-router";
import HomePage from "../../features/activities/dashboard/home/HomePage";


function App() {
 const location= useLocation();

  return (
    <Box sx={{ bgcolor: '#f1ececee', minHeight:'100vh'}}>
      <CssBaseline />  {/* mice liniju ispred navbara*/}

      {location.pathname === '/' ? <HomePage /> : (  // ako je path '/' prikazi pocetnu stranicu bez navbara
        <>
         <NavBar />  {/* Prikazuje navbar na vrhu */}
      <Container maxWidth='xl' sx={{ margin: 3 }} > 
        <Outlet />   {/* Outlet = MESTO gde se renderuju child rute iz routes.tsx ... ako je URL /activities → renderuje <ActivitiesList />*/}
      </Container>
        </>
      )}
    </Box>

  )
}

export default App

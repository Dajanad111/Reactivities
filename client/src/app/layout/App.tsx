
import { Box, Container, CssBaseline } from "@mui/material";
import NavBar from "./NavBar";

import { Outlet } from "react-router";


function App() {


  return (
    <Box sx={{ bgcolor: '#f1ececee', minHeight:'100vh'}}>
      <CssBaseline />  {/* mice liniju ispred navbara*/}
      <NavBar />
      <Container maxWidth='xl' sx={{ margin: 3 }} >
        <Outlet />
      </Container>
    </Box>

  )
}

export default App

import { Group } from "@mui/icons-material";
import { Box,Button, Typography } from "@mui/material";
import { Link } from "react-router";
import InteractiveBackground from "./InteractiveBackground";

export default function HomePage() {
  return (
  <InteractiveBackground>
  
  <Box className="home"
      sx={{
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      
      <Box sx={{ display: 'flex', alignItems: 'center', alignContent: 'center', color: 'white', gap: 3 }}>
        <Group sx={{ height: 110, width: 110 }} />
        <Typography variant="h1" fontWeight='bold'>
          Reactivities
        </Typography>
      </Box>
      <Typography variant="h2">
        Welcome to reactivities
      </Typography>
      <Button 
        component={Link} to='/activities' size='large' variant="contained" 
        sx={{height: 80, borderRadius: 4, fontSize: '1.5rem'}}>
        Take me to the activities!
      </Button>
    </Box>
    </InteractiveBackground>
  )
        
}
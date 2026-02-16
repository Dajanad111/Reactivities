import { Group } from "@mui/icons-material";
import { AppBar, Box, Container, LinearProgress, MenuItem, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router";
import MenuItemLink from "../shared/components/MenuItemLink";
import { useStore } from "../../lib/hooks/useStore";
import { Observer } from "mobx-react-lite";


export default function NavBar() {
   const {uiStore} = useStore();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" 
            sx={{ 
                backgroundImage: 'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)',
                position: 'relative'
            }} >
                <Container maxWidth='xl'>
                    <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>

                        <Box>
                            <MenuItem component={NavLink} to='/' sx={{display: 'flex', gap:2}}>   {/* koristimo menuitem, navlink i to */}
                            <Group fontSize="large" />
                            <Typography variant="h4" fontWeight={'bold'}> Reactivities</Typography>  {/* reactivities ce da vode na osnovni url tj '/' http://localhost:3000/  */}
                            </MenuItem>
                        </Box>

                        <Box sx={{display:'flex'}}>
                            <MenuItemLink  to='/activities'> {/*MenuItemLink smo napravili sami u menuItemLink.tsx da bi mijenjao boju kad je kliknut*/}
                                  Activities
                                </MenuItemLink>
                                <MenuItemLink  to='/createActivity'>
                                 Create Activity
                                </MenuItemLink>
                                 <MenuItemLink  to='/counter'>
                                 Counter
                                </MenuItemLink>
                               
                        </Box>

                         <MenuItem sx={{
                                fontSize: '1.2rem', textTransform: 'uppercase', fontWeight: 'bold'}} >
                            User menu
                        </MenuItem>

                    </Toolbar>
                </Container>

               <Observer>
                    {() =>
                        uiStore.isLoading ? (
                            <LinearProgress
                                color="secondary"
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: 4, // Adjust height if needed
                                }}
                            />
                        ) : null
                    }
                </Observer>

            </AppBar>
        </Box>
    )
}

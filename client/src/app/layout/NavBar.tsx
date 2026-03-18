import { Group } from "@mui/icons-material";
import { AppBar, Box, CircularProgress, Container, MenuItem, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router";
import MenuItemLink from "../shared/components/MenuItemLink";
import { useStore } from "../../lib/hooks/useStore";
import { Observer } from "mobx-react-lite";
import { useAccount } from "../../lib/hooks/useAccount";
import UserMenu from "./UserMenu";


export default function NavBar() {
    const { uiStore } = useStore();
    const { currentUser } = useAccount(); //da bi mogli da provjerimo da li imamo trenutnog ussera i sta da prikazemo ako imamo 

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed"
                sx={{
                    backgroundImage: 'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)',
                }} >
                <Container maxWidth='xl'>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

                        <Box>
                            <MenuItem component={NavLink} to='/' sx={{ display: 'flex', gap: 2 }}>   {/* koristimo menuitem, navlink i to */}
                                <Group fontSize="large" />
                                <Typography variant="h4" fontWeight={'bold'}> Reactivities</Typography>  {/* reactivities ce da vode na osnovni url tj '/' http://localhost:3000/  */}
                                <Observer>
                                    {() =>
                                        uiStore.isLoading ? (
                                            <CircularProgress
                                                size={20}
                                                thickness={7}
                                                sx={{
                                                    color: 'white',
                                                    position: 'absolute',
                                                    top: '30%',
                                                    left: '105%', 
                                                }}
                                            />
                                        ) : null
                                    }
                                </Observer>



                            </MenuItem>
                        </Box>

                        <Box sx={{ display: 'flex' }}>
                            <MenuItemLink to='/activities'> {/*MenuItemLink smo napravili sami u menuItemLink.tsx da bi mijenjao boju kad je kliknut*/}
                                Activities
                            </MenuItemLink>
                            <MenuItemLink to='/counter'>
                                Counter
                            </MenuItemLink>
                            <MenuItemLink to='/errors'>
                                Errors
                            </MenuItemLink>

                        </Box>
                        <Box display='flex' alignItems='center'>
                            {currentUser ? (
                                <UserMenu />
                            ) : (
                                <>
                                    <MenuItemLink to='/login'>Login</MenuItemLink>
                                    <MenuItemLink to='/register'>Register</MenuItemLink>
                                </>
                            )}
                        </Box>


                    </Toolbar>
                </Container>

            </AppBar>
        </Box>
    )
}

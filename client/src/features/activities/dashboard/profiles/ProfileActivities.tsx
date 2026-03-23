import { type SyntheticEvent, useEffect, useState } from "react";
import { Box, Card, CardContent, CardMedia, Grid, Tab, Tabs, Typography } from "@mui/material";
import { Link, useParams } from "react-router";
import { format } from "date-fns";
import { useProfile } from "../../../../lib/hooks/useProfile";
import type { Activity } from "../../../../lib/types";

export default function ProfileActivities() {
    const [activeTab, setActiveTab] = useState(0); //Da čuvamo koji je tab trenutno aktivan (0, 1, 2) /setActiveTab Funkcija za promjenu tog broja
    const { id } = useParams();         // Uzmi userId iz URL-a
    const { userActivities, setFilter, loadingUserActivities } = useProfile(id);

    useEffect(() => {
        setFilter('future') //  Postavi default na buduće evente
    }, [setFilter]) //Pokreni samo ako se setFilter promijeni
    //ovo se desava samo jednom na pocetku

    const tabs = [
        { menuItem: 'Future Events', key: 'future' },
        { menuItem: 'Past Events', key: 'past' },
        { menuItem: 'Hosting', key: 'hosting' }
    ];

    const handleTabChange = (_: SyntheticEvent, newValue: number) => { 
        setActiveTab(newValue); // Ažuriraj vizuelni prikaz (koji tab je "pritisnut")
        setFilter(tabs[newValue].key);  // Pošalji novi filter u API!
    };

    return (
        <Box>

            <Grid container spacing={2}> 
                <Grid size={12}>
                    <Tabs   //prikaz tabova
                        value={activeTab} //koji tab je aktivan
                        onChange={handleTabChange} //sta se desi na klik
                    >
                        {tabs.map((tab, index) => ( //loop kroz tabove
                            <Tab label={tab.menuItem} key={index} /> //  Prikaži tekst taba
                        ))}
                    </Tabs>
                </Grid>
            </Grid>

            {(!userActivities || userActivities.length === 0)  //ako nema podataka (userActivities iz useprofile)
			            && !loadingUserActivities ? ( // i ako  nije u toku učitavanje
                <Typography mt={2}> 
                    No activities to show 
                </Typography>
            ) : null}

            <Grid  //Prikaz kartica sa eventima
	            container 
		           spacing={2} 
		           sx={{ marginTop: 2, height: 400, overflow: 'auto' }}
            >
                {userActivities && userActivities.map((activity: Activity) => ( //ako imamo data onda za svaki element u nizu izvrši funkciju i vrati novi niz elemenata
                    <Grid size={2} key={activity.id}>  {/*svaki element u .map() mora imati jedinstveni key */}
                        <Link to={`/activities/${activity.id}`} //da mozes da kliknes na njih i da te vodi na activity
			                        style={{ textDecoration: 'none' }}>
                            <Card elevation={4}> {/*kartica" kontejner sa bijelom pozadinom, zaobljenim uglovima i sjénkom */}
                                <CardMedia
                                    component="img"
                                    height="100"
                                    image={
	                                    `/images/categoryImages/${activity.category}.jpg`
	                                   }
                                    alt={activity.title}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <CardContent>
                                    <Typography variant="h6" textAlign="center" mb={1}>
                                        {activity.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        textAlign="center"
                                        display='flex'
                                        flexDirection='column'
                                    >
                                        <span>
	                                        {format(activity.date, 'do LLL yyyy')}
	                                       </span>
                                        <span>{format(activity.date, 'h:mm a')}</span>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}
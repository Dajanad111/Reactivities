import { Box, Paper, Tab, Tabs } from "@mui/material";
import { type SyntheticEvent, useState } from "react";

import ProfileAbout from "./ProfileAbout";
import ProfilePhotos from "./ProfilePhotos";


export default function ProfileContent() {
    const [value, setValue] = useState(0);

    const handleChange = (_: SyntheticEvent, newValue: number) => {
        setValue(newValue); //kada kliknes na drugi tab on je sad aktivan 
    };

    const tabContent = [
        { label: 'About', content: <ProfileAbout /> },
        { label: 'Photos', content: <ProfilePhotos /> },
        { label: 'Events', content: <div>Events</div> },
        { label: 'Followers', content: <div>Followers</div> },
        { label: 'Following', content: <div>Following</div> }
    ];

    return (
        <Box
            component={Paper}
            mt={2}
            p={3}
            elevation={3}
            height={500}
            sx={{ display: 'flex', alignItems: 'flex-start', borderRadius: 3 }}
        >
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}  //da mozemo da klikcemo na tabove i da ih mijenjamo tako 
                sx={{ borderRight: 1, height: 450, minWidth: 200 }}
            >
                {tabContent.map((tab, index) => (  //prolazimo kroz sve tabove
                    <Tab key={index} label={tab.label} sx={{mr: 3}} />
                ))}
            </Tabs>
            <Box sx={{ flexGrow: 1, p: 3, pt: 0 }}>  {/*da prikazemo sta je u tabu*/}
                {tabContent[value].content} 
            </Box>
        </Box>
    )
}
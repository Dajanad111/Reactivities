import {  Grid, Typography } from "@mui/material"

import { useActivities } from "../../../../lib/hooks/useActivities";
import ActivityDetailsChat from "./ActivityDetailsChat";
import ActivityDetailsHeader from "./ActivityDetailsHeader";
import ActivityDetailsInfo from "./ActivityDetailsInfo";
import ActivityDetailsSidebar from "./ActivityDetailsSidebar";
import { useParams } from "react-router";


export default function ActivityDetailPage() {  
    const { id } = useParams(); //iz routes
    const { activity, isLoadingActivity } = useActivities(id);
    if (isLoadingActivity) return <Typography>Loading...</Typography>
    if (!activity) return <Typography>Activity not found</Typography>
    return (
    <Grid container spacing={3}>
        <Grid size={8}>
            <ActivityDetailsHeader 
             activity={activity} 
             />
            <ActivityDetailsInfo 
             activity={activity} 
            />
            <ActivityDetailsChat />
        </Grid>
        <Grid size={4}>
            <ActivityDetailsSidebar />
        </Grid>
    </Grid>

    )
}

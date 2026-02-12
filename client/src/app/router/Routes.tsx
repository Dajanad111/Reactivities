import { createBrowserRouter } from "react-router";
import App from "../layout/App";
import HomePage from "../../features/activities/dashboard/home/HomePage";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/dashboard/form/ActivityForm";
import ActivityDetail from "../../features/activities/dashboard/details/ActivityDetail";


export const router = createBrowserRouter([

    {
        path: '/',  //  URL putanja: https://example.com/
        element: <App />,    //  Komponenta koja se renderuje na ovoj putanji
        children: [  // Ugnježdene rute (nested routes)
            { path: '', element: <HomePage /> }, // na http://localhost:3000/ ce biti homepage
            { path: 'activities', element: <ActivityDashboard /> }, //na http://localhost:3000/activites ce bitiActivityDashboard
            { path: 'createActivity', element: <ActivityForm key='create'  /> }, //dodajmeo key da bi mogli da je otvorimo ako smo vec u edit formi
            { path: 'manage/:id', element: <ActivityForm  /> }, //za editovanje forme
             { path: 'activities/:id', element: <ActivityDetail /> }, //activities/:id nam daje jednu activity
        ]
           
    }
]);


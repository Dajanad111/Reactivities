import { createBrowserRouter, Navigate } from "react-router";
import App from "../layout/App";
import HomePage from "../../features/activities/dashboard/home/HomePage";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/dashboard/form/ActivityForm";
import ActivityDetailPage from "../../features/activities/dashboard/details/ActivityDetailPage";
import Counter from "../../features/activities/dashboard/counter/Counter";
import TestErrors from "../../features/activities/dashboard/errors/TestErrors";
import NotFound from "../../features/activities/dashboard/errors/NotFound";
import ServerError from "../../features/activities/dashboard/errors/ServerError";
import LoginForm from "../../features/activities/dashboard/account/LoginForm";
import RequireAuth from "./RequireAuth";
import RegisterForm from "../../features/activities/dashboard/account/RegisterForm";


export const router = createBrowserRouter([

    {
        path: '/',  //  URL putanja: https://example.com/
        element: <App />,    //  Komponenta koja se renderuje na ovoj putanji
        children: [  // Ugnježdene rute (nested routes)

            {element: <RequireAuth/>, children:[
                  { path: 'activities', element: <ActivityDashboard /> }, //na http://localhost:3000/activites ce bitiActivityDashboard
            { path: 'createActivity', element: <ActivityForm key='create' /> }, //dodajmeo key da bi mogli da je otvorimo ako smo vec u edit formi
            { path: 'manage/:id', element: <ActivityForm /> }, //za editovanje forme
            { path: 'activities/:id', element: <ActivityDetailPage /> }, //activities/:id nam daje jednu activity

            ]},
            { path: '', element: <HomePage /> }, // na http://localhost:3000/ ce biti homepage
            { path: 'counter', element: <Counter /> },
            { path: 'errors', element: <TestErrors /> },
            { path: 'not-found', element: <NotFound /> },
            { path: 'server-error', element: <ServerError /> },
            { path: 'login', element: <LoginForm /> },
              { path: 'register', element: <RegisterForm /> },
            { path: '*', element: <Navigate replace to= '/not-found' /> },
        ]

    }
]);


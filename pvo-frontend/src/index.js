import React from 'react';
import ReactDOM from 'react-dom/client';

import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Login from "./routes/login";
import Apply from "./routes/apply";
import ErrorPage from "./error-page";
import Admin from "./routes/admin";
import Editing from "./routes/editing"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="login"/>,
        errorElement: <ErrorPage/>,  // new
    },
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path: "/admin",
        element: <Admin/>,
    },
    {
        path: "/editing",
        element: <Editing/>,

    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

const appTheme = createTheme({
    palette: {
        blue: {
            main: '#00A3FF',
            light: '#0072E5',
            dark: '#0077FF',
            contrastText: '#000000',
        },
    },
    typography: {
        fontFamily: "'Segoe UI', sans-serif;",
    },
});


root.render(
    <ThemeProvider theme={appTheme}>
        <RouterProvider router={router}/>
    </ThemeProvider>
);


import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import Login from "./routes/login";
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
root.render(
    <RouterProvider router={router}/>
);


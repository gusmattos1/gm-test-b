import React from "react";
import DashboardLayout from "src/layouts/DashboardLayout";
import Dashboard from "src/views/Dashboard";
import NotFound from "src/views/Error/NotFound";
import NewDashboard from "src/views/NewDashboard/NewDashboard";
import Profile from "src/views/Profile/Profile";
import { Navigate } from "react-router-dom";

const routes = ({ user, setUserLogged }) => {
  return [
    {
      path: "/",
      element: <DashboardLayout user={user} setUserLogged={setUserLogged} />,
      children: [
        { path: "/", element: <Navigate to="/dashboard" /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "newdashboard", element: <NewDashboard /> },
        { path: "profile", element: <Profile /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ];
};

export default routes;

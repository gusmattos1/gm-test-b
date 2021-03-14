import CssBaseline from "@material-ui/core/CssBaseline";
import React, { useState } from "react";
import { useRoutes } from "react-router-dom";
import routes from "src/routes";
import Login from "src/views/Login/Login";
import "./App.css";
import MainLayout from "./layouts/MainLayout";

function App() {
  const [userLogged, setUserLogged] = useState();
  const routing = useRoutes(routes({ user: userLogged, setUserLogged }));

  if (!userLogged) {
    return (
      <>
        <MainLayout />
        <Login setUserLogged={setUserLogged} />
      </>
    );
  }

  return (
    <>
      <CssBaseline />
      {routing}
    </>
  );
}

export default App;

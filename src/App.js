import CssBaseline from "@material-ui/core/CssBaseline";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AppBar from "src/views/AppBar/AppBar";
import Dashboard from "src/views/Dashboard";
import Login from "src/views/Login/Login";
import Profile from "src/views/Profile/Profile";
import NotFound from "src/views/Error/NotFound";
import "./App.css";

function App() {
  const [userLogged, setUserLogged] = useState();

  if (!userLogged) {
    return <Login setUserLogged={setUserLogged} />;
  }

  return (
    <Router>
      <CssBaseline />

      <div>
        <AppBar user={userLogged} setUserLogged={setUserLogged} />

        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/">
            <Dashboard />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

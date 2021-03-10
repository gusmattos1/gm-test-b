import React, { useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";

function App() {
  const [userLogged, setUserLogged] = useState();

  if (!userLogged) {
    return <Login setUserLogged={setUserLogged} />;
  }

  return (
    <div className="App">
      <Logout />
      <br />
    </div>
  );
}

export default App;

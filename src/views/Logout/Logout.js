import Button from "@material-ui/core/Button";
import InputIcon from "@material-ui/icons/Input";
import React from "react";
import { useGoogleLogout } from "react-google-login";

function Logout({ setUserLogged }) {
  const clientId = process.env.REACT_APP_CLIENT_ID;

  const onLogoutSuccess = (res) => {
    // console.log("Logged out Success");
    // alert("Logged out Successfully ✌");
    setUserLogged();
  };

  const onFailure = () => {
    // console.log("Handle failure cases");
  };

  const { signOut } = useGoogleLogout({
    clientId,
    onLogoutSuccess,
    onFailure,
  });

  return (
    <Button
      data-testid="logout-button"
      onClick={signOut}
      color="inherit"
      startIcon={<InputIcon />}
    ></Button>
  );
}

export default Logout;

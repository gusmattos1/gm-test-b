import { Avatar } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useGoogleLogout } from "react-google-login";

const useStyles = makeStyles((theme) => ({
  userPicture: {
    width: "inherit",
    height: "inherit",
  },
}));

function Logout({ setUserLogged, user }) {
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const classes = useStyles();

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
      onClick={signOut}
      color="inherit"
      startIcon={
        <Avatar>
          <img
            src={user.imageUrl}
            alt="user profile"
            className={classes.userPicture}
          />
        </Avatar>
      }
    >
      Log out
    </Button>
  );
}

export default Logout;

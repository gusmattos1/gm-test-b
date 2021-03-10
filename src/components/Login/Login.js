import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import PropTypes from "prop-types";
import React from "react";
import { useGoogleLogin } from "react-google-login";
import GoogleLogo from "../../assets/icons/google.svg";
import { refreshTokenSetup } from "../../utils/refreshToken";
import Copyright from "../Copyright/Copyright";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function Login({ setUserLogged }) {
  const classes = useStyles();

  const clientId = process.env.REACT_APP_CLIENT_ID;

  const onSuccess = (res) => {
    console.log("Login Success: currentUser:", res.profileObj);

    refreshTokenSetup(res);

    setUserLogged(true);
  };

  const onFailure = (res) => {
    // console.log("Login failed: res:", res);
    alert(`Failed to login.`);
    setUserLogged(false);
  };

  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    isSignedIn: true,
    accessType: "offline",
  });

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <button onClick={signIn} className="button">
          <img src={GoogleLogo} alt="google login" className="icon"></img>

          <span className="buttonText">Sign in with Google</span>
        </button>
      </div>
      <Copyright />
    </Container>
  );
}

Login.propTypes = {
  setUserLogged: PropTypes.func.isRequired,
};

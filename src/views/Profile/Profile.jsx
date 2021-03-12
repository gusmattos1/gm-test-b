import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import Page from "src/components/Page";
import { getAddress } from "./utils";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    overflow: "visible"
    // backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  root: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(2)
  },
  profileIcon: {
    objectFit: "contain"
  },
  box: {
    display: "flex",
    justifyContent: "center",
    paddingBottom: theme.spacing(4)
  }
}));

export default function SignUp() {
  const [profile, setProfile] = useState();
  const [error, setError] = useState(false);
  const classes = useStyles();

  const fetchProfile = async () => {
    try {
      const data = await fetch("https://randomuser.me/api");
      const profile = await data.json();

      if (profile.results && profile.results.length > 0) {
        setProfile(profile.results[0]);
      }
    } catch (error) {
      console.error("Error on fetchProfile", error);
      setError(true);
    }
  };

  const generateProfile = () => {
    if (profile)
      return (
        <form className={classes.form} noValidate data-testid="profile-form">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                data-testid="first-name"
                label="First Name"
                fullWidth
                variant="outlined"
                value={profile.name.first || ""}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                fullWidth
                variant="outlined"
                value={profile.name.last || ""}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Gender"
                fullWidth
                variant="outlined"
                value={profile.gender || ""}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Naturalization"
                fullWidth
                variant="outlined"
                value={profile.nat || ""}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="Email"
                value={profile.email || ""}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="Phone"
                value={profile.cell || ""}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                data-testid="address"
                variant="outlined"
                fullWidth
                label="Address"
                value={getAddress(profile) || ""}
                InputProps={{
                  readOnly: true
                }}
                multiline
                rowsMax={4}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Age"
                fullWidth
                variant="outlined"
                value={profile.dob.age || ""}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Birthdate"
                fullWidth
                variant="outlined"
                value={profile.dob.date.split("T")[0] || ""}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
          </Grid>
        </form>
      );
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile && !error) {
    return (
      <div className={classes.root} data-testid="profile-spinner">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.root}>
        <Typography variant="h6" className={classes.title} align="center">
          Error fetching profile
        </Typography>
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setError(false);
            fetchProfile();
          }}
        >
          Refetch
        </Button>
      </div>
    );
  }

  return (
    <Page className={classes.root} title="Profile">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <img
              src={profile.picture.medium}
              alt="profile icon"
              className={classes.profileIcon}
            ></img>
          </Avatar>
          {generateProfile()}
        </div>
        <Box mt={5} className={classes.box}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setError(false);
              fetchProfile();
            }}
          >
            Refetch
          </Button>
        </Box>
      </Container>
    </Page>
  );
}

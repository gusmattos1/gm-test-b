import React from "react";
import { useGoogleLogout } from "react-google-login";
import GoogleLogo from "../../assets/icons/google.svg";

function Logout() {
  const clientId = process.env.REACT_APP_CLIENT_ID;

  const onLogoutSuccess = (res) => {
    // console.log("Logged out Success");
    alert("Logged out Successfully ✌");
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
    <button onClick={signOut} className="button">
      <img src={GoogleLogo} alt="google login" className="icon"></img>

      <span className="buttonText">Sign out</span>
    </button>
  );
}

export default Logout;

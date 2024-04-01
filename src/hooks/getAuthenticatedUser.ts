import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "@clerk/clerk-react";
import { useHistory } from "react-router";

export default function isSignedIn() {
  const history = useHistory();
  const { isSignedIn, isLoaded } = useAuth();

  if (isLoaded && !isSignedIn) {
    console.log('Not signed in')
    history.push("/");
    window.location.reload();
    return isSignedIn
  }

  return isSignedIn
}
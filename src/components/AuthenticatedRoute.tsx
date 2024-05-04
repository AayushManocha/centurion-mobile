import { SignOutButton, useAuth } from "@clerk/clerk-react";
import isSignedIn from "../hooks/getAuthenticatedUser";
import LoginPage from "../pages/auth/Login";
import { IonButton, IonSpinner } from "@ionic/react";
import { useHistory } from "react-router";
import axios from "axios";

interface AuthenticatedRouteProps {
  children: React.ReactNode
}

export default function AuthenticatedRoute({ children }: AuthenticatedRouteProps) {
  const { isSignedIn, isLoaded, getToken } = useAuth();

  const healthcheckEndpoint = async () => {
    const token = await getToken()
    axios.get(`${import.meta.env.VITE_API_URL}/healthcheck`, { headers: { Authorization: `Bearer ${token}` } })
  }

  if (!isLoaded) {
    return (
      <div>
        <IonSpinner />
      </div>
    )
  } else if (isLoaded && !isSignedIn) {
    return <LoginPage />
  } else {
    return (
      <div>
        {children}
        {/* <IonButton onClick={healthcheckEndpoint}>Healthcheck</IonButton> */}
      </div>
    )
  }
}
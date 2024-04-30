import { useAuth } from "@clerk/clerk-react";
import { IonSpinner } from "@ionic/react";
import Home from "../pages/Home";
import { useHistory } from "react-router";

interface UnauthenticatedRouteProps {
  children: React.ReactNode
}

export default function AuthenticatedRoute({ children }: UnauthenticatedRouteProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const hisory = useHistory();

  console.log('isLoaded', isLoaded)
  console.log('isSignedIn', isSignedIn)

  if (!isLoaded) return (
    <div>
      <IonSpinner />
    </div>
  )

  if (isLoaded && isSignedIn) {
    return <Home />
  }

  return children
}
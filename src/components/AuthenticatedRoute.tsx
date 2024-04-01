import { useAuth } from "@clerk/clerk-react";
import isSignedIn from "../hooks/getAuthenticatedUser";
import LoginPage from "../pages/auth/Login";
import { IonSpinner } from "@ionic/react";

interface AuthenticatedRouteProps {
  children: React.ReactNode
  useAuthHook?: any
}

export default function AuthenticatedRoute({ children, useAuthHook }: AuthenticatedRouteProps) {
  const { isSignedIn, isLoaded } = useAuthHook ? useAuthHook() : useAuth();

  if (!isLoaded) return (
    <div>
      <IonSpinner />
    </div>
  )

  if (isLoaded && !isSignedIn) {
    <LoginPage />
  }

  return children
}
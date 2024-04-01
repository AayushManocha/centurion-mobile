import { User, useAuth0 } from "@auth0/auth0-react";
import { Browser } from "@capacitor/browser";
import { SignInButton, SignOutButton, UserButton, useAuth } from "@clerk/clerk-react";
import { IonButton } from "@ionic/react";

const LoginPage: React.FC = () => {

  const { getToken } = useAuth();

  const getAccessToken = () => {
    getToken().then((token) => {
      console.log(token);
    });
  }

  const redirectUrl = 'http://localhost:8100/home';

  return (
    <div style={{ margin: 'auto', width: '50%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1>Welcome to Centurion</h1>
      <SignInButton redirectUrl={redirectUrl}>
        <IonButton>
          Get Started
        </IonButton>
      </SignInButton>
    </div>
  );
}


const LoginButton: React.FC = () => {
  return <SignInButton>
    <IonButton>
      Sign in with clerk
    </IonButton>
  </SignInButton>
};

export default LoginPage;
import { User, useAuth0 } from "@auth0/auth0-react";
import { Browser } from "@capacitor/browser";
import { RedirectToSignIn, SignIn, SignInButton, SignOutButton, UserButton, useAuth, useSignIn, useSignUp } from "@clerk/clerk-react";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonInput } from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";
import UnauthenticatedRoute from "../../components/UnauthenticatedRoute";

const LoginPage: React.FC = () => {


  const { signUp, setActive } = useSignUp();
  const { signIn } = useSignIn()

  const [userIsCreatingNewAccount, setUserIsCreatingNewAccount] = React.useState<boolean>(true);

  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const [verificationCode, setVerificationCode] = React.useState<string>('');
  const [pendingVerification, setPendingVerification] = React.useState<boolean>(false);

  const hisory = useHistory()

  const handleSignup = async ({ email, password, firstName, lastName }) => {
    await signUp.create({ emailAddress: email, password });

    setPendingVerification(true);
    await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
  }

  const handleSignin = async ({ email, password }) => {
    await signIn.create({ identifier: email, password });
    await setActive({ session: signIn.createdSessionId })
    hisory.push('/dashboard')
  }

  const verifyEmailCode = async () => {
    const completeSignUp = await signUp.attemptEmailAddressVerification({ code: verificationCode })
    await setActive({ session: completeSignUp.createdSessionId })
    hisory.push('/dashboard')
  }

  if (userIsCreatingNewAccount) {
    return (
      <UnauthenticatedRoute>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Create Account</IonCardTitle>
              <IonCardSubtitle>Create an account to continue</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              {!pendingVerification ? (
                <>
                  <div style={{ margin: '24px 12px' }}>
                    <IonInput placeholder="Email" type="email" onIonInput={(e) => setEmail(e.detail.value!)} />
                    <IonInput placeholder="Password" type="password" onIonInput={(e) => setPassword(e.detail.value!)} />
                    <IonButton style={{ width: '100%' }} onClick={() => handleSignup({ email, password, firstName, lastName })}>Create Account</IonButton>
                  </div>
                  <div>
                    <p>Already have an account?</p>
                    <IonButton type="" onClick={() => setUserIsCreatingNewAccount(false)}>Sign In</IonButton>
                  </div>
                </>
              ) : (
                <div>
                  <span>Check your e-mail for a verification code to complete registration</span>
                  <IonInput placeholder="Verification Code" onIonInput={(e) => setVerificationCode(e.detail.value!)} />
                  <IonButton onClick={verifyEmailCode}>Verify</IonButton>
                </div>
              )}
            </IonCardContent>
          </IonCard>
        </div>
      </UnauthenticatedRoute>
    );
  }

  return (
    <UnauthenticatedRoute>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Sign In</IonCardTitle>
            <IonCardSubtitle>Sign in to continue</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <div style={{ margin: '24px 12px' }}>
              <IonInput placeholder="Email" type="email" onIonInput={(e) => setEmail(e.detail.value!)} />
              <IonInput placeholder="Password" type="password" onIonInput={(e) => setPassword(e.detail.value!)} />
              <IonButton style={{ width: '100%' }} onClick={() => handleSignin({ email, password })}>Sign In</IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </div>
    </UnauthenticatedRoute>
  );

}




export default LoginPage;
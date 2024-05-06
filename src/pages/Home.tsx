import { IonButton, IonContent, IonHeader, IonPage, IonSpinner, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import isSignedIn from '../hooks/getAuthenticatedUser';
import { SignOutButton, useAuth } from '@clerk/clerk-react';
import { useQuery } from 'react-query';
import axios from 'axios';
import AuthenticatedRoute from '../components/AuthenticatedRoute';
import React from 'react';
import { useHistory } from 'react-router';


const Home: React.FC = () => {
  // const authState = isSignedIn()
  const { getToken } = useAuth()
  const hisory = useHistory()

  const query = useQuery({
    queryKey: ['onboarding'],
    retry: false,
    queryFn: async () => {
      const token = await getToken()
      console.log('token is', token)
      const response = await axios.get(`/onboarding/status`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
      console.log('response is', response.data)
      if (!response.data.hasIncome) {
        console.log('redirecting to onboarding income')
        // hisory.push('/onboarding-income')
        hisory.push('/dashboard')
      } else if (!response.data.hasSpendingCategory) {
        console.log('redirecting to onboarding categories')
        hisory.push('/onboarding-categories')
      } else {
        console.log('redirecting to dashboard')
        hisory.push('/dashboard')
      }
    }
  })


  return <IonSpinner />
};

const AuthenticatedHome: React.FC = () => {
  return (
    <AuthenticatedRoute>
      <IonPage>
        <Home />
      </IonPage>
    </AuthenticatedRoute>
  )
}

export default AuthenticatedHome;

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
      const response = await axios.get('http://localhost:8080/onboarding/status', { headers: { Authorization: `Bearer ${token}` } })
      console.log('response', response)
      if (!response.data.hasIncome) {
        hisory.push('/onboarding-income')
      } else if (!response.data.hasSpendingCategory) {
        hisory.push('/onboarding-categories')
      } else {
        hisory.push('/dashboard')
      }
      // Todo Redirect to dashboard if user has already completed onboarding
    }
  })


  return <IonSpinner />
};

const AuthenticatedHome: React.FC = () => {
  return (
    <AuthenticatedRoute>
      <Home />
    </AuthenticatedRoute>
  )
}

export default AuthenticatedHome;

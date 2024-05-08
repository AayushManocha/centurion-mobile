import { IonButton, IonContent, IonHeader, IonPage, IonSpinner, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import isSignedIn from '../hooks/getAuthenticatedUser';
import { SignOutButton, useAuth } from '@clerk/clerk-react';
import { useQuery } from 'react-query';
import AuthenticatedRoute from '../components/AuthenticatedRoute';
import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { AxiosContext } from '../providers/AxiosProvider';


const Home: React.FC = () => {
  const { getToken } = useAuth()
  const axios = useContext(AxiosContext)
  const hisory = useHistory()

  const query = useQuery({
    queryKey: ['onboarding'],
    retry: false,
    queryFn: async () => {
      const token = await getToken()
      const response = await axios.get(`/onboarding/status`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
      if (!response.data.hasIncome) {
        // hisory.push('/onboarding-income')
        hisory.push('/dashboard')
      } else if (!response.data.hasSpendingCategory) {
        hisory.push('/onboarding-categories')
      } else {
        hisory.push('/dashboard')
      }
    }
  })


  return <IonSpinner />
};

const AuthenticatedHome: React.FC = () => {
  return (
    <IonPage>
      <AuthenticatedRoute>
        <Home />
      </AuthenticatedRoute>
    </IonPage>
  )
}

export default AuthenticatedHome;

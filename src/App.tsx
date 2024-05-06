import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonNav, IonRouterOutlet, isPlatform, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import LoginPage from './pages/auth/Login';
import { App as CapApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import OnboardingIncome from './pages/onboarding/OnboardingIncome';
import OnboardingTransactionCategories from './pages/onboarding/OnboardingTransactionCategories';
import AddTransaction from './pages/AddTransaction';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import WeeklyDashboard from './components/dashboards/WeeklyDashboard';
import AuthenticatedIndexDashboard from './pages/dashboards/IndexDashboard';
import CategoryDetail from './pages/categories/CategoryDetail';

setupIonicReact();

const App: React.FC = () => {

  const publishableKey = 'pk_test_Y2xvc2UtYmFkZ2VyLTExLmNsZXJrLmFjY291bnRzLmRldiQ'
  const queryClient = new QueryClient()

  return (
    //@ts-ignore
    <ClerkProvider publishableKey={publishableKey}>
      <QueryClientProvider client={queryClient}>
        <IonApp>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route exact path="/home">
                <Home />
              </Route>
              <Route exact path="/">
                <LoginPage />
              </Route>
              <Route exact path="/onboarding-income">
                <OnboardingIncome />
              </Route>
              <Route exact path="/onboarding-categories">
                <OnboardingTransactionCategories />
              </Route>
              <Route exact path="/dashboard">
                <AuthenticatedIndexDashboard />
              </Route>
              <Route exact path="/add-transaction">
                <AddTransaction />
              </Route>
              <Route path="/category/:id" component={CategoryDetail} />
            </IonRouterOutlet>
          </IonReactRouter>
        </IonApp>
      </QueryClientProvider>
    </ClerkProvider>
  )
};

export default App;

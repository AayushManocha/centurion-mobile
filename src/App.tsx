import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactHashRouter, IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

/* Theme variables */
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import AddTransaction from './pages/AddTransaction';
import Metrics from './pages/Metrics';
import LoginPage from './pages/auth/Login';
import CategoryDetail from './pages/categories/CategoryDetail';
import AuthenticatedIndexDashboard from './pages/dashboards/IndexDashboard';
import OnboardingIncome from './pages/onboarding/OnboardingIncome';
import OnboardingTransactionCategories from './pages/onboarding/OnboardingTransactionCategories';
import './theme/variables.css';
import { AxiosProvider } from './providers/AxiosProvider';

setupIonicReact();



const App: React.FC = () => {

  const publishableKey = 'pk_test_Y2xvc2UtYmFkZ2VyLTExLmNsZXJrLmFjY291bnRzLmRldiQ'
  const queryClient = new QueryClient()

  return (
    //@ts-ignore
    <ClerkProvider publishableKey={publishableKey}>
      <QueryClientProvider client={queryClient}>
        <AxiosProvider>
          <IonApp>
            <IonReactHashRouter>
              <IonRouterOutlet>
                <Route exact path="/home">
                  <Home />
                </Route>
                <Route exact path="/login">
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
                <Route exact path="/">
                  <Redirect to="/dashboard" />
                </Route>
                <Route exact path="/add-transaction">
                  <AddTransaction />
                </Route>
                <Route exact path="/metrics">
                  <Metrics />
                </Route>
                <Route path="/category/:id" component={CategoryDetail} />
              </IonRouterOutlet>
            </IonReactHashRouter>
          </IonApp>
        </AxiosProvider>
      </QueryClientProvider>
    </ClerkProvider>
  )
};

export default App;

import { IonActionSheet, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar } from "@ionic/react";
import { add } from "ionicons/icons";
import { useState } from "react";
import { useHistory } from "react-router";
import AuthenticatedRoute from "../../components/AuthenticatedRoute";
import TimeTravel from "../../components/TimeTravel";
import MonthlyDashboard from "../../components/dashboards/MonthlyDashboard";
import WeeklyDashboard from "../../components/dashboards/WeeklyDashboard";
import { getMondayOfThisWeek } from "../../utils/date-utils";

function IndexDashboard() {
  const history = useHistory()
  const navigateToAddTransaction = () => {
    history.push('/add-transaction')
  }

  const navigateToOnboardingCategories = () => {
    history.push('/onboarding-categories')
  }

  const navigateToMetrics = () => {
    history.push('/metrics')
  }

  const [currentDate, setCurrentDate] = useState(getMondayOfThisWeek())

  const handleRefresh = (event: CustomEvent) => {
    setTimeout(() => {
    }, 2000);
  }


  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <TimeTravel date={currentDate} setDate={setCurrentDate} />
        <WeeklyDashboard currentDate={currentDate} />
        <MonthlyDashboard currentDate={currentDate} />
      </IonContent>

      <IonFab id="open-action-sheet" style={{ position: 'absolute', bottom: '24px', right: '24px' }} slot="fixed" horizontal="end" vertical="bottom">
        <IonFabButton onClick={() => { }}>
          <IonIcon icon={add}>Add Transaction</IonIcon>
        </IonFabButton>
      </IonFab>
      <IonActionSheet trigger="open-action-sheet" header="Actions" buttons={[
        {
          text: 'Add Transaction',
          handler: navigateToAddTransaction
        },
        {
          text: 'Manage Budget',
          handler: navigateToOnboardingCategories
        },
        {
          text: 'View Metrics',
          handler: navigateToMetrics
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]}>
      </IonActionSheet>
    </>
  );
}

export default function AuthenticatedIndexDashboard() {
  return (
    <IonPage>
      <AuthenticatedRoute>
        <IndexDashboard />
      </AuthenticatedRoute>
    </IonPage>
  );
}
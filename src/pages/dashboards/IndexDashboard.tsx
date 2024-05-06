import { IonFab, IonFabButton, IonIcon, IonFabList, IonActionSheet, NavContext, IonPage, IonHeader, IonToolbar, IonTitle } from "@ionic/react";
import { add } from "ionicons/icons";
import AuthenticatedRoute from "../../components/AuthenticatedRoute";
import MonthlyDashboard from "../../components/dashboards/MonthlyDashboard";
import WeeklyDashboard from "../../components/dashboards/WeeklyDashboard";
import { useHistory } from "react-router";
import TimeTravel from "../../components/TimeTravel";
import { useState } from "react";
import { getMondayOfThisWeek } from "../../utils/date-utils";

function IndexDashboard() {
  const history = useHistory()
  const navigateToAddTransaction = () => {
    history.push('/add-transaction')
  }

  const navigateToOnboardingCategories = () => {
    history.push('/onboarding-categories')
  }

  const [currentDate, setCurrentDate] = useState(getMondayOfThisWeek())


  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <TimeTravel date={currentDate} setDate={setCurrentDate} />
      <WeeklyDashboard currentDate={currentDate} />
      <MonthlyDashboard currentDate={currentDate} />
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
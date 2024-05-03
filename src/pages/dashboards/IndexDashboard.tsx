import { IonFab, IonFabButton, IonIcon, IonFabList, IonActionSheet } from "@ionic/react";
import { add } from "ionicons/icons";
import AuthenticatedRoute from "../../components/AuthenticatedRoute";
import MonthlyDashboard from "../../components/dashboards/MonthlyDashboard";
import WeeklyDashboard from "../../components/dashboards/WeeklyDashboard";
import { useHistory } from "react-router";

function IndexDashboard() {
  const history = useHistory()
  const navigateToAddTransaction = () => {
    history.push('/add-transaction')
  }

  return (
    <div>
      <WeeklyDashboard />
      <MonthlyDashboard />
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
          text: 'Cancel',
          role: 'cancel'
        }
      ]}>
      </IonActionSheet>
    </div>
  );
}

export default function AuthenticatedIndexDashboard() {
  return (
    <AuthenticatedRoute>
      <IndexDashboard />
    </AuthenticatedRoute>
  );
}
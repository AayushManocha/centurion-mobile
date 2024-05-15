import { IonButton, IonButtons, IonCard, IonContent, IonHeader, IonIcon, IonPage, IonSpinner, IonTitle, IonToolbar } from "@ionic/react"
import AuthenticatedRoute from "../components/AuthenticatedRoute"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"
import { useQuery } from "react-query"
import { chevronBackOutline } from "ionicons/icons"

export default function Metrics() {
  const { getToken } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ['get-monthly-metrics'],
    queryFn: async () => {
      const authToken = await getToken()
      const currentMonth = new Date()
      const currentMonthWithLeadingZero = currentMonth.getMonth() + 1 < 10 ? `0${currentMonth.getMonth() + 1}` : currentMonth.getMonth() + 1
      const dateSlug = `${currentMonth.getFullYear()}-${currentMonthWithLeadingZero}-01`
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/metrics/monthly/${dateSlug}`, { headers: { Authorization: `Bearer ${authToken}` } })
      return response.data
    },
  })

  console.log('data: ', data)

  return (
    <IonPage>
      <AuthenticatedRoute>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => history.go(-1)}>
                <IonIcon icon={chevronBackOutline} />
                Back
              </IonButton>
            </IonButtons>
            <IonTitle>Metrics</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          {isLoading && <IonSpinner />}
          {data && (
            data.metrics.map((metric: any) => {
              return <MonthlyMetricDisplay metric={metric.Metrics} date={new Date(metric.Date)} />
            })
          )}
        </IonContent>
      </AuthenticatedRoute>
    </IonPage>
  )

}

interface MonthlyMetricDisplayProps {
  metric: any
  date: Date
}


function MonthlyMetricDisplay(props: MonthlyMetricDisplayProps) {
  const { totalSpend, totalBudget, remaining } = props.metric
  return (
    <IonCard>
      <h2 style={{ alignSelf: 'flex-start', color: 'white', fontWeight: 'bold', fontSize: '1.5em', margin: '12px', padding: '24px' }} onClick={() => { }} >
        {`${props.date.toDateString().split(" ")[1]} ${props.date.getFullYear()}`}
        {/* <div>
          <span style={{ fontSize: '0.4em', fontStyle: 'italic', marginRight: '24px' }}>${100}/month</span>
          <span style={{ fontSize: '0.4em', fontStyle: 'italic' }}>${100 / 4}/week</span>
        </div> */}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'row', width: '90%', justifyContent: 'space-between', margin: '12px', padding: '24px' }}>
        <div id="total-expense" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ color: 'white', fontWeight: '500' }}>
            Total Spent
          </div>
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5em' }}>
            ${totalSpend}
          </div>
        </div>
        <div id="remaining-budget" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ color: 'white', fontWeight: '500' }}>
            Remaining
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '1.5em' }}>
            ${remaining}
          </div>
        </div>
      </div>
    </IonCard>
  )
}
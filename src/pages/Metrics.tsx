import { IonCard, IonPage } from "@ionic/react"
import AuthenticatedRoute from "../components/AuthenticatedRoute"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"
import { useQuery } from "react-query"

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
        <MonthlyMetricDisplay />
      </AuthenticatedRoute>
    </IonPage>
  )

}

function MonthlyMetricDisplay() {
  return (
    <IonCard>
      <h2 style={{ alignSelf: 'flex-start', color: 'white', fontWeight: 'bold', fontSize: '1.5em' }} onClick={() => { }}>
        {`May 2024`}
        {/* <div>
          <span style={{ fontSize: '0.4em', fontStyle: 'italic', marginRight: '24px' }}>${100}/month</span>
          <span style={{ fontSize: '0.4em', fontStyle: 'italic' }}>${100 / 4}/week</span>
        </div> */}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', margin: '12px' }}>
        <div id="total-expense" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ color: 'white', fontWeight: '500' }}>
            Total Spent
          </div>
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5em' }}>
            ${500}
          </div>
        </div>
        <div id="remaining-budget" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ color: 'white', fontWeight: '500' }}>
            Remaining
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '1.5em' }}>
            ${Math.abs(100)}
          </div>
        </div>
      </div>
    </IonCard>
  )
}
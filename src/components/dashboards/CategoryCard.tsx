import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from "@ionic/react"
import { useHistory } from "react-router"

interface CategoryCardProps {
  title: string
  totalExpense: number
  remainingBudget: number
  categoryId: number
  totalBudget: number
}

export default function CategoryCard(props: CategoryCardProps) {
  const { title, totalExpense, remainingBudget, categoryId, totalBudget } = props
  const color = remainingBudget < 0 ? 'red' : 'limegreen'

  const history = useHistory()
  const naviateToDetails = () => {
    history.push(`/category/${categoryId}`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ alignSelf: 'flex-start', color: 'white', fontWeight: 'bold', fontSize: '1.5em' }} onClick={naviateToDetails}>
        {title}
        <div>
          <span style={{ fontSize: '0.4em', fontStyle: 'italic', marginRight: '24px' }}>${totalBudget}/month</span>
          <span style={{ fontSize: '0.4em', fontStyle: 'italic' }}>${totalBudget / 4}/week</span>
        </div>
      </h2>
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', margin: '12px' }}>
        <div id="total-expense" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ color: 'white', fontWeight: '500' }}>
            Total Spent
          </div>
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5em' }}>
            ${totalExpense}
          </div>
        </div>
        <div id="remaining-budget" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ color: 'white', fontWeight: '500' }}>
            Remaining
          </div>
          <div style={{ color, fontWeight: 'bold', fontSize: '1.5em' }}>
            ${Math.abs(remainingBudget)}
          </div>
        </div>
      </div>
      {/* <IonButton onClick={naviateToDetails} fill="outline" style={{ width: '100%' }}>
        View
      </IonButton> */}
    </div>
  )
}
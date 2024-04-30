
import { useAuth } from "@clerk/clerk-react";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFab, IonFabButton, IonIcon, IonInput, IonSpinner } from "@ionic/react";
import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router";
import { add } from 'ionicons/icons';
import CategoryCard from "./CategoryCard";

interface CategoryExpense {
  categoryTitle: string
  categoryId: number
  totalExpense: number
  remainingBudget: number
  totalBudget: number
}

interface MonthlyDashboardProps {
  authServiceHook?: any
}

export default function MonthlyDashboard(props: MonthlyDashboardProps) {

  const [categoryExpenses, setCategoryExpenses] = React.useState<CategoryExpense[]>([])

  const { getToken } = props.authServiceHook ? props.authServiceHook() : useAuth()
  const { isLoading, data } = useQuery({
    queryKey: 'get-monthly-dashboard',
    queryFn: async () => {
      const authToken = await getToken()

      const currentMonth = new Date()
      const currentMonthWithLeadingZero = currentMonth.getMonth() + 1 < 10 ? `0${currentMonth.getMonth() + 1}` : currentMonth.getMonth() + 1
      const dateSlug = `${currentMonth.getFullYear()}-${currentMonthWithLeadingZero}-01`
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/monthly/${dateSlug}`, { headers: { Authorization: `Bearer ${authToken}` } })
      console.log('response', response.data)
      return response.data
    },
  })


  const history = useHistory()
  const navigateToAddTransaction = () => {
    history.push('/add-transaction')
  }

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Monthly Dashboard</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {isLoading ? <IonSpinner /> : null}
          {data && (
            <div>
              {data?.categoryExpenses?.map((category: CategoryExpense) => (
                <CategoryCard
                  totalBudget={category.totalBudget}
                  categoryId={category.categoryId}
                  title={category.categoryTitle}
                  totalExpense={category.totalExpense}
                  remainingBudget={category.remainingBudget} />
              ))}
            </div>
          )}
        </IonCardContent>
      </IonCard >
      <IonFab style={{ position: 'absolute', bottom: '24px', right: '24px' }}>
        <IonFabButton onClick={navigateToAddTransaction}>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>
    </>
  )
}
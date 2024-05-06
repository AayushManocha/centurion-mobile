
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
  currentDate: Date
}

export default function MonthlyDashboard(props: MonthlyDashboardProps) {

  const [categoryExpenses, setCategoryExpenses] = React.useState<CategoryExpense[]>([])

  const { getToken } = props.authServiceHook ? props.authServiceHook() : useAuth()
  const { currentDate } = props

  const { isLoading, data } = useQuery({
    queryKey: ['get-monthly-dashboard', currentDate],
    queryFn: async () => {
      const authToken = await getToken()

      const currentMonth = currentDate
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

  const currentMonth = currentDate.toDateString().split(" ")[1]
  const currentYear = currentDate.getFullYear()

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{currentMonth} {currentYear}</IonCardTitle>
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
    </>
  )
}
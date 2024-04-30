import { useAuth } from "@clerk/clerk-react";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFab, IonFabButton, IonIcon, IonInput, IonSpinner } from "@ionic/react";
import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router";
import { add } from 'ionicons/icons';
import CategoryCard from "./CategoryCard";
import { getMondayOfThisWeek } from "../../utils/date-utils";

interface CategoryExpense {
  categoryTitle: string
  categoryId: number
  totalExpense: number
  remainingBudget: number
  totalBudget: number
}

export default function WeeklyDashboard() {
  const { getToken } = useAuth()

  const { isLoading, data } = useQuery({
    queryKey: 'get-weekly-dashboard',
    queryFn: async () => {
      const authToken = await getToken()
      const mondayOfThisWeek = getMondayOfThisWeek()
      const dateSlug = mondayOfThisWeek.toISOString().split('T')[0]


      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/weekly/${dateSlug}`, { headers: { Authorization: `Bearer ${authToken}` } })
      return response.data

    },
    cacheTime: 1,
  })


  const history = useHistory()
  const navigateToAddTransaction = () => {
    history.push('/add-transaction')
  }

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Weekly Dashboard</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {isLoading ? <IonSpinner /> : (
            data && (
              <div>
                {data?.categoryExpenses?.map((category: CategoryExpense) => (
                  <CategoryCard
                    categoryId={category.categoryId}
                    title={category.categoryTitle}
                    totalExpense={category.totalExpense}
                    remainingBudget={category.remainingBudget} totalBudget={category.totalBudget} />
                ))}
              </div>
            )
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
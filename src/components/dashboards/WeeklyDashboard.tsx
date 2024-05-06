import { useAuth } from "@clerk/clerk-react";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFab, IonFabButton, IonFabList, IonIcon, IonInput, IonSpinner } from "@ionic/react";
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

interface WeeklyDashboardProps {
  currentDate: Date
}


export default function WeeklyDashboard(props: WeeklyDashboardProps) {
  const { getToken } = useAuth()
  const { currentDate } = props

  const { isLoading, data } = useQuery({
    queryKey: ['get-weekly-dashboard', currentDate],
    queryFn: async () => {
      const authToken = await getToken()
      const mondayOfThisWeek = currentDate
      console.log('mondayOfThisWeek:', mondayOfThisWeek)

      const year = mondayOfThisWeek.getFullYear()
      const month = mondayOfThisWeek.getMonth() <= 9 ? `0${mondayOfThisWeek.getMonth() + 1}` : mondayOfThisWeek.getMonth() + 1
      const day = mondayOfThisWeek.getDate() <= 9 ? `0${mondayOfThisWeek.getDate()}` : mondayOfThisWeek.getDate()

      const dateSlug = `${year}-${month}-${day}`
      console.log('dateSlug:', dateSlug)

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/weekly/${dateSlug}`, { headers: { Authorization: `Bearer ${authToken}` } })
      return response.data

    },
    cacheTime: 1,
  })


  const history = useHistory()


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

    </>
  )
}
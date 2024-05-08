import { useAuth } from "@clerk/clerk-react";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSpinner } from "@ionic/react";
import axios from "axios";
import { useQuery } from "react-query";
import CategoryCard from "./CategoryCard";

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

      const year = mondayOfThisWeek.getFullYear()
      const month = mondayOfThisWeek.getMonth() <= 9 ? `0${mondayOfThisWeek.getMonth() + 1}` : mondayOfThisWeek.getMonth() + 1
      const day = mondayOfThisWeek.getDate() <= 9 ? `0${mondayOfThisWeek.getDate()}` : mondayOfThisWeek.getDate()

      const dateSlug = `${year}-${month}-${day}`

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/weekly/${dateSlug}`, { headers: { Authorization: `Bearer ${authToken}` } })
      return response.data

    },
    cacheTime: 1,
  })

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>This Week</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {isLoading ? <IonSpinner /> : (
            data && (
              <div>
                {data?.categoryExpenses?.map((category: CategoryExpense) => (
                  <CategoryCard
                    key={category.categoryId}
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
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonPage } from "@ionic/react";
import AuthenticatedRoute from "../../components/AuthenticatedRoute";
import { RouteComponentProps } from "react-router";
import { useQuery } from "react-query";
import { useAuth } from "@clerk/clerk-react";

interface CategoryDetailProps extends RouteComponentProps<{ id: string }> { }

export default function CategoryDetail(props: CategoryDetailProps) {
  const { id } = props.match.params

  const { getToken } = useAuth()

  const { isLoading, data } = useQuery({
    queryKey: ['get-category', id],
    queryFn: async () => {
      const authToken = await getToken()
      const response = await fetch(`http://localhost:8080/categories/${id}`, { headers: { Authorization: `Bearer ${authToken}` } })
      return response.json()
    },
    cacheTime: 1,

  })

  function formatDate(date) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let d = new Date(date);
    let month = monthNames[d.getMonth()];
    let day = d.getDate();
    return `${month}-${day}`;
  }

  console.log('data', data)

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <AuthenticatedRoute>
      <IonPage>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{data.category.title}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {data.expenses.map((expense: any) => (
                <div key={expense.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p>{formatDate(expense.date)}</p>
                  <p>${expense.amount}</p>
                  <p>{expense.description}</p>
                </div>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonPage>
    </AuthenticatedRoute>
  );
}

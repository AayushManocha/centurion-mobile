import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import AuthenticatedRoute from "../../components/AuthenticatedRoute";
import { RouteComponentProps } from "react-router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuth } from "@clerk/clerk-react";
import { chevronBackOutline, trashBinOutline } from "ionicons/icons";

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

  console.log('data: ', data)


  const queryClient = useQueryClient()
  const deleteTransaction = useMutation({
    mutationFn: async (id: number) => {
      const authToken = await getToken()
      await fetch(`http://localhost:8080/expense/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${authToken}` } })
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries('get-category')
      queryClient.invalidateQueries('get-monthly-dashboard')
      queryClient.invalidateQueries('get-weekly-dashboard')
    },
  })

  function formatDate(date) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let d = new Date(date);
    let month = monthNames[d.getMonth()];
    let day = d.getDate();
    return `${month}-${day}`;
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <IonPage>
      <AuthenticatedRoute>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.go(-1)}>
              <IonIcon icon={chevronBackOutline} />
              Back
            </IonButton>
          </IonButtons>
          <IonTitle>Add Transaction</IonTitle>
        </IonToolbar>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{data.category.title}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {data.expenses.map((expense: any) => (
                <div key={expense.ID} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p>{formatDate(expense.date)}</p>
                  <p>${expense.amount}</p>
                  <p>{expense.description}</p>
                  <IonButton shape="round" fill="clear" onClick={() => deleteTransaction.mutate(expense.ID)}>
                    <IonIcon icon={trashBinOutline} />
                  </IonButton>
                </div>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>
      </AuthenticatedRoute>
    </IonPage>
  );
}

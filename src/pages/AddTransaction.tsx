import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonHeader, IonIcon, IonInput, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar } from "@ionic/react";
import AuthenticatedRoute from "../components/AuthenticatedRoute";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useHistory } from "react-router";
import { arrowBack, chevronBackOutline } from "ionicons/icons";

interface SpendingCategory {
  ID: number
  title: string
}

function AddTransaction() {
  const history = useHistory()
  const currentDate = new Date().toISOString().split('T')[0]

  const [amount, setAmount] = React.useState<number | undefined>()
  const [description, setDescription] = React.useState<string | undefined>()
  const [category, setCategory] = React.useState<number | undefined>()

  const { getToken } = useAuth()
  const [availableCategories, setAvailableCategories] = React.useState<SpendingCategory[]>([])
  const fetchCategoriesQuery = useQuery({
    queryKey: 'get-categories',
    queryFn: async () => {
      const authToken = await getToken()
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`, { headers: { Authorization: `Bearer ${authToken}` } })
      setAvailableCategories(response.data.categories)
    }
  })

  console.log('amount: ', amount)

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (transaction: { amount: number, date: string, description: string, category_id: number }) => {
      const authToken = await getToken()
      await axios.post(`${import.meta.env.VITE_API_URL}/expense`, transaction, { headers: { Authorization: `Bearer ${authToken}` } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries('get-weekly-dashboard')
      queryClient.invalidateQueries('get-monthly-dashboard')
      history.push('/dashboard')
    }
  })

  const handleSaveTransaction = () => {
    const request_body = {
      amount: amount,
      date: currentDate,
      description: description,
      category_id: category
    }

    console.log('request_body:', request_body)
    mutation.mutate(request_body)
  }


  const handleCategoryChange = (newCategoryName) => {
    console.log('newCategoryName:', newCategoryName)
    const categoryId = availableCategories.filter(category => category.title === newCategoryName)[0]?.ID
    console.log('categoryId:', categoryId)
    setCategory(newCategoryName)
  }

  console.log('category:', category)

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.go(-1)}>
              <IonIcon icon={chevronBackOutline} />
              Back
            </IonButton>
          </IonButtons>
          <IonTitle>Add Transaction</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonCard>
        <IonCardHeader>
          <h1>Add Transaction</h1>
        </IonCardHeader>
        <IonCardContent>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <IonSelect placeholder="Category" onIonChange={(e) => handleCategoryChange(e.detail.value)}>
              {availableCategories.map(category => (
                <IonSelectOption value={category.ID}>{category.title}</IonSelectOption>
              ))}
            </IonSelect>
            <IonInput type="number" placeholder="Amount" value={amount} onIonInput={e => setAmount(parseFloat(e.detail.value))} />
            <IonInput type="text" placeholder="Description" value={description} onIonChange={e => setDescription(e.detail.value)} />
            <IonInput type="date" placeholder="Date" value={currentDate} disabled />
            <IonButton onClick={handleSaveTransaction}>Add</IonButton>
          </div>
        </IonCardContent>
      </IonCard>
    </>
  )
}

export default function AuthenticatedAddTransaction() {
  return (
    <IonPage>
      <AuthenticatedRoute>
        <AddTransaction />
      </AuthenticatedRoute>
    </IonPage>
  )
}


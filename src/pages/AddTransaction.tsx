import { IonButton, IonCard, IonCardContent, IonCardHeader, IonInput, IonSelect, IonSelectOption } from "@ionic/react";
import AuthenticatedRoute from "../components/AuthenticatedRoute";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useHistory } from "react-router";

interface SpendingCategory {
  ID: number
  title: string
}

function AddTransaction() {

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
      const response = await axios.get('http://localhost:8080/categories', { headers: { Authorization: `Bearer ${authToken}` } })
      setAvailableCategories(response.data.categories)
    }
  })

  const history = useHistory()
  const mutation = useMutation({
    mutationFn: async (transaction: { amount: number, date: string, description: string, category_id: number }) => {
      const authToken = await getToken()
      await axios.post('http://localhost:8080/expense', transaction, { headers: { Authorization: `Bearer ${authToken}` } })
    },
    onSuccess: () => history.push('/dashboard')
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


  const handleCategoryChange = (newCategoryName: string) => {
    console.log('newCategoryName:', newCategoryName)
    const categoryId = availableCategories.filter(category => category.title === newCategoryName)[0]?.ID
    console.log('categoryId:', categoryId)
    setCategory(categoryId)
  }

  return (
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
          <IonInput type="number" placeholder="Amount" value={amount} onIonChange={e => setAmount(parseFloat(e.detail.value))} />
          <IonInput type="text" placeholder="Description" value={description} onIonChange={e => setDescription(e.detail.value)} />
          <IonInput type="date" placeholder="Date" value={currentDate} disabled />
          <IonButton onClick={handleSaveTransaction}>Add</IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  )
}

export default function AuthenticatedAddTransaction() {
  return (
    <AuthenticatedRoute>
      <AddTransaction />
    </AuthenticatedRoute>
  )
}


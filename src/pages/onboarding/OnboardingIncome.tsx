import { useAuth } from "@clerk/clerk-react";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonInput, IonPage } from "@ionic/react";
import axios from "axios";
import React from "react";
import { useMutation } from "react-query";
import { useHistory } from "react-router";
import AuthenticatedRoute from "../../components/UnauthenticatedRoute";

interface OnboardingIncomeProps {
  useAuthHook?: any
}

export default function OnboardingIncome(props: OnboardingIncomeProps) {
  console.log('ONBOARDING INCOME')
  const [income, setIncome] = React.useState<undefined | number>()
  const { getToken } = useAuth()

  const history = useHistory()
  const redirectToOnboardingCategories = () => {
    history.push('/onboarding-categories')
  }

  const mutation = useMutation({
    mutationKey: 'update-income',
    mutationFn: async (income: number) => {
      const authToken = await getToken()
      await axios.post(`${import.meta.env.VITE_API_URL}/onboarding/income`, { income }, { headers: { Authorization: `Bearer ${authToken}` } })
    },
    onSuccess: redirectToOnboardingCategories
  })

  const handleSave = () => {
    if (!income) return
    mutation.mutate(income)
  }

  return (
    <IonPage>
      <AuthenticatedRoute>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Income</IonCardTitle>
            <IonCardSubtitle>How much do you make?</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <p>Let's start by understanding your income.</p>
            <p>How much do you make in a year?</p>

            <p>Don't worry, we won't share this information with anyone.</p>

            <p>Enter your annual income:</p>
            <IonInput type="number" placeholder="Annual income" value={income} onIonChange={(e) => setIncome(parseInt(e.detail.value || ''))} />
            <IonButton onClick={handleSave}>Next</IonButton>
          </IonCardContent>
        </IonCard>
      </AuthenticatedRoute>
    </IonPage>
  )
}
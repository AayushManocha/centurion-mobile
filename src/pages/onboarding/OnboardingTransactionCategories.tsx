import { useAuth } from "@clerk/clerk-react";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCheckbox, IonContent, IonHeader, IonInput, IonToast } from "@ionic/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import AuthenticatedRoute from "../../components/AuthenticatedRoute";
import { useHistory } from "react-router";

interface Categories {
  title: string
  budgetAmount: number
  isTrackedWeekly: boolean
}

interface OnboardingTransactionCategoriesProps {
  useAuthHook?: any
}


export default function OnboardingTransactionCategories(props: OnboardingTransactionCategoriesProps) {
  const [categories, setCategories] = useState<Categories[]>([])
  const [currentCategory, setCurrentCategory] = useState<string>('')
  const [currentBudget, setCurrentBudget] = useState<string>('')
  const [currentIsTrackedWeekly, setCurrentIsTrackedWeekly] = useState<boolean>(false)

  const addCategory = (category: string) => {
    const existingCategory = categories.find(c => c.title === category)
    if (existingCategory) {
      return
    }

    setCurrentCategory('')
    setCurrentBudget('')
    setCurrentIsTrackedWeekly(false)

    console.log('currentBudget', currentBudget)
    const parsedBudget = parseFloat(currentBudget)

    setCategories([...categories, { title: category, budgetAmount: parsedBudget, isTrackedWeekly: currentIsTrackedWeekly }])
  }

  const removeCategory = (category: string) => {
    setCategories(categories.filter(c => c.title !== category))
  }

  const history = useHistory()
  const redirectToWeeklyDashboard = () => {
    openToast('Categories saved!')
    history.push('/dashboard')
  }

  const authHook = props.useAuthHook ? props.useAuthHook : useAuth
  const { getToken } = authHook()

  const [toastIsOpen, setToastIsOpen] = useState(false)
  const [toastContent, setToastContent] = useState('' as string)

  const closeToast = () => {
    setToastIsOpen(false)
    setToastContent('')
  }

  const openToast = (content: string) => {
    setToastIsOpen(true)
    setToastContent(content)
  }

  const mutation = useMutation({
    mutationKey: 'update-categories',
    mutationFn: async (categories: Categories[]) => {
      const authToken = await getToken()
      await axios.post(`${import.meta.env.VITE_API_URL}/onboarding/spending-categories`, { categories }, { headers: { Authorization: `Bearer ${authToken}` } })
    },
    onSuccess: redirectToWeeklyDashboard,
    onError: () => openToast('Error saving categories')
  })

  const handleSave = () => {
    console.log('categories', categories)
    mutation.mutate(categories)
  }

  return (
    <AuthenticatedRoute>
      <IonCard>
        <IonCardHeader>
          <h1>Transaction Categories</h1>
          <p>What categories do you spend money on?</p>
        </IonCardHeader>
        <IonCardContent>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '30%' }}>
            <IonInput type="text" placeholder="Category" onIonInput={e => setCurrentCategory(e.detail.value || '')} value={currentCategory || ''} />
            <IonInput type="text" placeholder="Budget" onIonInput={e => setCurrentBudget(e.detail.value || '')} value={currentBudget || ''} />
            <IonCheckbox labelPlacement="end" value={currentIsTrackedWeekly} onIonChange={e => setCurrentIsTrackedWeekly(e.detail.checked)}>Track Weekly?</IonCheckbox>
            <IonButton onClick={() => addCategory(currentCategory || '')}>Add</IonButton>
          </div>
          <ul data-testid="current-categories">
            {categories.map(category => (
              <li key={category.title}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '80%' }}>
                    <span> {category.title} </span>
                    <span> ${category.budgetAmount} </span>
                    <span>
                      {category.isTrackedWeekly ? 'Tracked Weekly' : 'Not Tracked Weekly'}
                    </span>
                  </div>
                  <IonButton onClick={() => removeCategory(category.title)}>Remove</IonButton>
                </div>
              </li>
            ))}
          </ul>
          <IonButton onClick={handleSave}>Next</IonButton>
        </IonCardContent>
      </IonCard >
      <IonToast isOpen={toastIsOpen} onDidDismiss={closeToast} duration={3000} message={toastContent} />
    </AuthenticatedRoute>
  )
}

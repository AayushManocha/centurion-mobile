import { useAuth } from "@clerk/clerk-react";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCheckbox, IonContent, IonHeader, IonIcon, IonInput, IonToast } from "@ionic/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import AuthenticatedRoute from "../../components/AuthenticatedRoute";
import { useHistory } from "react-router";
import { pencilOutline, trashOutline } from "ionicons/icons";

interface Categories {
  id?: number
  title: string
  budgetAmount: number
  isTrackedWeekly: boolean
  isBeingEdited?: boolean
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
      const filteredCategories = categories.filter(c => c.id === undefined)
      await axios.post(`${import.meta.env.VITE_API_URL}/onboarding/spending-categories`, { filteredCategories }, { headers: { Authorization: `Bearer ${authToken}` } })
    },
    onSuccess: redirectToWeeklyDashboard,
    onError: () => openToast('Error saving categories')
  })

  const handleSave = () => {
    console.log('categories', categories)
    mutation.mutate(categories)
  }

  // Populate categories from API
  const { isLoading, data } = useQuery({
    queryKey: 'get-categories',
    queryFn: async () => {
      const authToken = await getToken()
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`, { headers: { Authorization: `Bearer ${authToken}` } })
      return response.data
    },
    onSuccess: (data) => {
      setCategories(data?.categories?.map((category) => {
        return {
          id: category.id,
          title: category.title,
          budgetAmount: category.budgetAmount,
          isTrackedWeekly: category.isTrackedWeekly
        }
      }))
    },
    cacheTime: 1,
  })

  console.log('data: ', data)

  const editCategory = (category: string) => {
    const updatedCategories = categories.map(c => {
      if (c.title === category) {
        return { ...c, isBeingEdited: true }
      }
      return c
    })

    setCategories(updatedCategories)
  }

  return (
    <AuthenticatedRoute>
      <IonCard>
        <IonCardHeader>
          <h1>Transaction Categories</h1>
          <p>What categories do you spend money on?</p>
        </IonCardHeader>
        <IonCardContent>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '1005' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '30%' }}>
              <IonInput type="text" placeholder="Category" onIonInput={e => setCurrentCategory(e.detail.value || '')} value={currentCategory || ''} />
              <IonInput type="text" placeholder="Budget" onIonInput={e => setCurrentBudget(e.detail.value || '')} value={currentBudget || ''} />
              <IonCheckbox labelPlacement="end" value={currentIsTrackedWeekly} onIonChange={e => setCurrentIsTrackedWeekly(e.detail.checked)}>Track Weekly?</IonCheckbox>
              <IonButton onClick={() => addCategory(currentCategory || '')}>Add</IonButton>
            </div>
            <div data-testid="current-categories" style={{ margin: '12px' }}>
              {categories.map(category => {
                return category.isBeingEdited ?
                  <EditCategoryItem category={category} removeCategory={removeCategory} editCategory={editCategory} /> :
                  <CategoryItem category={category} removeCategory={removeCategory} editCategory={editCategory} />
              })}
            </div>
            <IonButton expand="full" onClick={handleSave}>Save</IonButton>
          </div>
        </IonCardContent>
      </IonCard >
      <IonToast isOpen={toastIsOpen} onDidDismiss={closeToast} duration={3000} message={toastContent} />
    </AuthenticatedRoute>
  )
}

interface CategoryItemProps {
  category: Categories
  removeCategory: (category: string) => void
  editCategory: (category: string) => void
}

function CategoryItem(props: CategoryItemProps) {
  const { category, removeCategory, editCategory } = props
  return (
    <div key={category.title}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', textDecoration: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '80%' }}>
          <span> {category.title} </span>
          <span> ${category.budgetAmount} </span>
          <span>
            {category.isTrackedWeekly ? 'Weekly' : 'Monthly'}
          </span>
        </div>
        <IonButton onClick={() => removeCategory(category.title)}>
          <IonIcon icon={trashOutline} />
        </IonButton>
        <IonButton onClick={() => editCategory(category.title)}>
          <IonIcon icon={pencilOutline} />
        </IonButton>
      </div>
    </div>
  )
}

function EditCategoryItem(props: CategoryItemProps) {
  const { category, removeCategory, editCategory } = props
  return (
    <div key={category.title}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', textDecoration: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '80%' }}>
          <input value={category.title} />
          <span> ${category.budgetAmount} </span>
          <span>
            {category.isTrackedWeekly ? 'Weekly' : 'Monthly'}
          </span>
        </div>
        <IonButton onClick={() => removeCategory(category.title)}>
          Save
        </IonButton>
      </div>
    </div>
  )

}
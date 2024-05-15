import { useAuth } from "@clerk/clerk-react";
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCheckbox, IonContent, IonHeader, IonIcon, IonInput, IonPage, IonSpinner, IonTitle, IonToast, IonToolbar } from "@ionic/react";
import axios from "axios";
import { chevronBackOutline, pencilOutline, trashOutline } from "ionicons/icons";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router";
import AuthenticatedRoute from "../../components/AuthenticatedRoute";

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
      await axios.post(`${import.meta.env.VITE_API_URL}/onboarding/spending-categories`, { categories: filteredCategories }, { headers: { Authorization: `Bearer ${authToken}` } })
    },
    onSuccess: redirectToWeeklyDashboard,
    onError: () => openToast('Error saving categories')
  })

  const handleSave = () => {
    console.log('categories', categories)
    mutation.mutate(categories)
  }

  // Populate categories from API
  const { isLoading, data, refetch } = useQuery({
    queryKey: 'get-categories',
    queryFn: async () => {
      const authToken = await getToken()
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`, { headers: { Authorization: `Bearer ${authToken}` } })
      return response.data
    },
    onSuccess: (data) => {
      setCategories(data?.categories?.map((category) => {
        return {
          id: category.ID,
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
    <IonPage>
      <AuthenticatedRoute>
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
        <IonContent fullscreen>
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
                {isLoading && <IonSpinner />}
                <div data-testid="current-categories" style={{ margin: '12px' }}>
                  {categories.map(category => {
                    return category.isBeingEdited ?
                      <EditCategoryItem category={category} removeCategory={removeCategory} editCategory={editCategory} refreshCategories={refetch} /> :
                      <CategoryItem category={category} removeCategory={removeCategory} editCategory={editCategory} refreshCategories={refetch} />
                  })}
                </div>
                <IonButton expand="full" onClick={handleSave}>Save</IonButton>
              </div>
            </IonCardContent>
          </IonCard >
        </IonContent>
        <IonToast isOpen={toastIsOpen} onDidDismiss={closeToast} duration={3000} message={toastContent} />
      </AuthenticatedRoute>
    </IonPage>
  )
}

interface CategoryItemProps {
  category: Categories
  removeCategory: (category: string) => void
  editCategory: (category: string) => void
  refreshCategories?: () => void
}

function CategoryItem(props: CategoryItemProps) {
  const { category, removeCategory, editCategory, refreshCategories } = props
  const { getToken } = useAuth()

  const handleDeleteCategory = () => {
    console.log('category', category)
    if (category.id) {
      deleteMutation.mutate()
      return
    }
    removeCategory(category.title)
  }

  const deleteMutation = useMutation({
    mutationKey: `delete-category-${category?.id}`,
    mutationFn: async () => {
      const authToken = await getToken()
      await axios.delete(`${import.meta.env.VITE_API_URL}/categories/${category.id}`, { headers: { Authorization: `Bearer ${authToken}` } })
    },
    onSuccess: refreshCategories,
    // onError: () => openToast('Error saving categories')
  })

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
        <IonButton onClick={() => handleDeleteCategory()}>
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
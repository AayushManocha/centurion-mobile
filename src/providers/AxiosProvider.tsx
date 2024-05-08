import { useClerk } from "@clerk/clerk-react"
import axios, { AxiosStatic } from "axios"
import { createContext } from "react"


export const AxiosContext = createContext<AxiosStatic>(null)

export const AxiosProvider = ({ children }) => {
  const { signOut } = useClerk()
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response.status === 401) {
        signOut()
        console.log('redirecting to login')
        // window.location.href = '/'
        // window.location.reload()
      }
      return Promise.reject(error)
    }
  )
  return (
    <AxiosContext.Provider value={axios}>
      {children}
    </AxiosContext.Provider>
  )
}

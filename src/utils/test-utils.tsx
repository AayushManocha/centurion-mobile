import { render } from "@testing-library/react"
import { options } from "ionicons/icons"
import { QueryClient, QueryClientProvider } from "react-query"
import { vi } from "vitest"

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

const customRender = (ui: any, options?: any) => {
  render(ui, { wrapper: TestWrapper, ...options })
}

export * from '@testing-library/react'
export { customRender as render }
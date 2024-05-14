import MonthlyDashboard from "./MonthlyDashboard"
import { vi } from 'vitest'
import { QueryClient, QueryClientProvider } from "react-query"
import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'
import { render, waitFor, screen } from "../../utils/test-utils"

// const server = setupServer(
//   http.get('http://localhost:8080/dashboard/monthly/:dateSlug', (req, res, ctx) => {
//     return HttpResponse.json({
//       categoryExpenses: [
//         {
//           categoryTitle: 'Groceries',
//           categoryId: 1,
//           totalExpense: 100,
//           remainingBudget: 200
//         }
//       ]
//     }, { status: 200 })
//   })
// )

// beforeAll(() => server.listen())
// afterEach(() => server.resetHandlers())
// afterAll(() => server.close())

test('Content is rendered appropriately', async () => {
  const useAuth = vi.fn(() => ({ getToken: vi.fn(() => 'fake-token') }))
  render(<MonthlyDashboard authServiceHook={useAuth} currentDate={null} />)

  // Wait for the text to be rendered
  await waitFor(() => expect(screen.getByText('Monthly Dashboard')).toBeInTheDocument(), { timeout: 5000 })

  expect(screen.getByText('Groceries')).toBeInTheDocument()
})
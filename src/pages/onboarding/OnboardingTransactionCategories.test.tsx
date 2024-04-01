import { vi } from "vitest"
import { act, fireEvent, render, renderHook, screen, waitFor } from "../../utils/test-utils"
import OnboardingTransactionCategories from "./OnboardingTransactionCategories"
import { setupServer } from "msw/node"
import { HttpResponse, http } from "msw"

// const server = setupServer(
//   http.post('http://localhost:8080/onboarding/spending-categories', (req: any, res: any, ctx: any) => {
//     const categories = req.body.categories
//     console.log("Categories: ", categories)
//     if (categories.length !== 1) return HttpResponse.json({}, { status: 400 })
//     if (categories[0].title !== 'Groceries') return HttpResponse.json({}, { status: 400 })
//     if (categories[0].budgetAmount !== 100) return HttpResponse.json({}, { status: 400 })
//     if (categories[0].isTrackedWeekly !== true) return HttpResponse.json({}, { status: 400 })
//     return HttpResponse.json({}, { status: 200 })
//   })
// )

// beforeAll(() => server.listen())
// afterEach(() => server.resetHandlers())
// afterAll(() => server.close())

test('Test OnboardingTransactionCategories request is correct', async () => {
  const mockUseAuth = vi.fn(() => ({ getToken: vi.fn(() => 'fake-token'), isLoaded: true, isSignedIn: true }))
  render(<OnboardingTransactionCategories useAuthHook={mockUseAuth} />)

  await waitFor(() => expect(screen.getByText('Transaction Categories')).toBeInTheDocument(), { timeout: 5000 })

  await act(async () => {
    const categoryInput = await screen.findByPlaceholderText('Category')
    const budgetInput = await screen.findByPlaceholderText('Budget')
    // const checkboxInput = await screen.findByRole('checkbox')

    await fireEvent.change(categoryInput, { target: { value: 'Groceries' } })
    await fireEvent.change(budgetInput, { target: { value: 100 } })

    const addButton = await screen.findByText('Add')
    await fireEvent.click(addButton)

    const saveButton = await screen.findByText('Next')
    await fireEvent.click(saveButton)
    // await fireEvent.click(checkboxInput)
  })

  expect(screen.getByTestId('current-categories')).toContainElement(screen.getByText('Groceries'))


  // waitFor(() => expect(screen.getByText('Categories saved!')).toBeInTheDocument())
  // expect(screen.getByText('Categories saved!')).toBeInTheDocument()

}) 
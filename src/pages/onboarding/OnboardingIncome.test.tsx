import { vi } from "vitest"
import { fireEvent, render, screen } from "../../utils/test-utils"
import OnboardingIncome from "./OnboardingIncome"
import { setupServer } from "msw/node"
import { HttpResponse, http } from "msw"

// const server = setupServer(
//   http.post('http://localhost:8080/onboarding/income', (req, res, ctx) => {
//     const income = req.body.income
//     if (income !== 50000) {
//       return HttpResponse.json({ error: 'Invalid income' }, { status: 400 })
//     }
//     return HttpResponse.json({}, { status: 200 })
//   })
// 
// )

test('Income onboarding request is fired correctly', async () => {
  const useAuth = vi.fn(() => ({ getToken: vi.fn(() => 'fake-token') }))
  render(<OnboardingIncome useAuthHook={useAuth} />)

  const inputField = screen.getByPlaceholderText('Annual income')
  await fireEvent.change(inputField, { target: { value: '50000' } })
  await fireEvent.click(screen.getByText('Next'))
})
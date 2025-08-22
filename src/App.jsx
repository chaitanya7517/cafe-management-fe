import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthForm } from "./components/login-form"
import { ResetPasswordForm } from "./components/reset-password-form"
import { Toaster } from "sonner"
import { Dashboard } from "./components/Dashboard"
import Page from "./app/dashboard/Page"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/auth/reset-password" element={<ResetPasswordForm />} />
      </Routes>
    </BrowserRouter>
  )
}

// function App() {
//   return <Page />
// }

export default App
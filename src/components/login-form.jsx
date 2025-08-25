import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { loginWithEmail, registerUser, forgotPassword, loginWithGoogle } from "../service/authService"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useNavigate } from 'react-router-dom'
import { setToken } from '../utils/auth'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from "jwt-decode";

export function AuthForm({ className, ...props }) {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    usernameOrEmail: "",
  })
  const [error, setError] = useState(null)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      if (isLogin) {
        const res = await loginWithEmail(formData.usernameOrEmail, formData.password)
        if (res.status === 200) {
          // Store the token from x-authorization header
          const token = res.data.accessToken  
          setToken(token)
          toast.success("Login successful!")
          navigate('/dashboard')
        }
      } else {
        const res = await registerUser(
          formData.username,
          formData.email,
          formData.password,
          formData.confirmPassword
        )
        if (res.status === 200) {
          const token = res.data.accessToken  
          setToken(token)
          toast.success("Account created successfully!")
          navigate('/dashboard')
        }
      }
    } catch (err) {
      const errorMessage = err.message === "Passwords do not match"
        ? "Passwords do not match"
        : isLogin
          ? "Login failed. Please check your credentials."
          : "Signup failed. Please try again."
      toast.error(err.message || errorMessage)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await forgotPassword(resetEmail)
      if (res.status === 200) {
        toast.success("Password reset email sent successfully!", {
          description: "Please check your email inbox",
          duration: 5000,
          action: {
            label: "Close",
            onClick: () => toast.dismiss(),
          },
        })
        setShowForgotPassword(false)
        setResetEmail("")
      }
    } catch (err) {
      toast.error("Failed to send reset email", {
        description: err.message || "Please try again later",
        duration: 5000,
        action: {
          label: "Try Again",
          onClick: () => setShowForgotPassword(true),
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential)
      console.log("Decoded token:", decoded) // For debugging
      
      // Rest of your Google login logic
      const res = await loginWithGoogle(credentialResponse.credential)
      if (res.status === 200) {
        const token = res.data.accessToken  
        setToken(token)
        toast.success("Google login successful!")
        navigate('/dashboard')
      }
    } catch (err) {
      console.error("Google login error:", err) // For debugging
      toast.error(err.message || "Google login failed")
    }
  }

  const clearForm = () => {
    setFormData({
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      usernameOrEmail: "",
    })
    setError(null)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <h1 className="text-3xl font-bold mb-6">Welcome!!!</h1>
      <div className={cn("flex flex-col gap-6 w-full max-w-[400px]", className)} {...props}>
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {isLogin ? "Welcome back" : "Create an account"}
            </CardTitle>
            <CardDescription>
              {isLogin ? "Login with your account" : "Sign up for an account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                {
                  isLogin && <div className="flex flex-col gap-4">
                    <GoogleLogin
                      render={renderProps => (
                        <Button 
                          type="button"
                          variant="outline" 
                          className="w-full flex items-center justify-center gap-2"
                          onClick={renderProps.onClick}
                          disabled={renderProps.disabled}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            className="w-5 h-5"
                          >
                            <path
                              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                              fill="currentColor"
                            />
                          </svg>
                          Login with Google
                        </Button>
                      )}
                      onSuccess={handleGoogleSuccess}
                      onError={() => toast.error('Google login failed')}
                    />
                  </div>
                }
                {
                  isLogin && <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                      Or continue with
                    </span>
                  </div>
                }

                <div className="grid gap-6">
                  {!isLogin && (
                    <div className="grid gap-3">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  {
                    isLogin && (
                      <div className="grid gap-3">
                        <Label htmlFor="username">Username Or Email</Label>
                        <Input
                          id="usernameOrEmail"
                          name="usernameOrEmail"
                          type="text"
                          required
                          value={formData.usernameOrEmail}
                          onChange={handleChange}
                        />
                      </div>
                    )
                  }
                  {
                    !isLogin && (
                      <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    )
                  }

                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      {
                        !isLogin ? null : (
                          <a
                            href="#"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                            onClick={(e) => {
                              e.preventDefault()
                              setShowForgotPassword(true)
                            }}
                          >
                            Forgot your password?
                          </a>
                        )
                      }

                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  {!isLogin && (
                    <div className="grid gap-3">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  <Button type="submit" className="w-full">
                    {isLogin ? "Login" : "Sign up"}
                  </Button>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <div className="text-center text-sm">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <a
                      href="#"
                      className="underline underline-offset-4"
                      onClick={() => {
                        setIsLogin(!isLogin)
                        clearForm()
                      }}
                    >
                      {isLogin ? "Sign up" : "Login"}
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="grid gap-3">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
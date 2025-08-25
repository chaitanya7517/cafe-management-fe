import axios from "axios"

export const loginWithEmail = async (email, password) => {
  const res = await axios.post('http://localhost:8080/auth/login', {
    usernameOrEmail: email,
    password: password,
  })
  return res
}

export const registerUser = async (username, email, password, confirmPassword) => {
  // Username validation - only allow letters and numbers
  const usernameRegex = /^[a-zA-Z0-9]+$/
  if (!usernameRegex.test(username)) {
    throw new Error("Username can only contain letters and numbers")
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match")
  }
  
  try {
    const res = await axios.post('http://localhost:8080/auth/register', {
      username: username,
      email: email,
      password: password
    })
    return res
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed")
  }
}

export const forgotPassword = async (email) => {
  try {
    const res = await axios.post('http://localhost:8080/auth/forgot-password/token', {
      email: email
    })
    return res
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to send reset email")
  }
}

export const resetPassword = async (token, newPassword, confirmPassword) => {
  try {
    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match")
    }
    
    const res = await axios.post(`http://localhost:8080/auth/forgot-password?token=${token}`, {
      newPassword: newPassword
    })
    return res
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to reset password")
  }
}

export const loginWithGoogle = async (credential) => {
  try {
    const res = await axios.post('http://localhost:8080/auth/google/login', {
      credential: credential
    })
    return res
  } catch (error) {
    throw new Error(error.response?.data?.message || "Google login failed")
  }
}
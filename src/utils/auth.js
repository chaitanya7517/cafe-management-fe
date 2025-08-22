export const setToken = (token) => {
  localStorage.setItem('x-authorization', token)
}

export const getToken = () => {
  return localStorage.getItem('x-authorization')
}

export const removeToken = () => {
  localStorage.removeItem('x-authorization')
}

export const isAuthenticated = () => {
  return !!getToken()
}
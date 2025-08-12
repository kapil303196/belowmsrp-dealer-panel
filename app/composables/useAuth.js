export const useAuth = () => {
  const authenticated = useState('auth-authenticated', () => false)
  const user = useState('auth-user', () => null)

  const checkAuth = () => {
    if (process.client) {
      const auth = localStorage.getItem('auth')
      if (auth) {
        try {
          const authData = JSON.parse(auth)
          authenticated.value = authData.authenticated
          user.value = authData.user
        } catch (e) {
          console.error('Failed to parse auth data', e)
        }
      }
    }
  }

  const login = (email, password) => {
    if (email === 'admin@example.com' && password === 'password') {
      authenticated.value = true
      user.value = {
        id: 1,
        email,
        name: 'Admin User',
        role: 'admin'
      }
      
      if (process.client) {
        localStorage.setItem('auth', JSON.stringify({
          authenticated: authenticated.value,
          user: user.value
        }))
      }
      
      return true
    }
    return false
  }

  const logout = () => {
    authenticated.value = false
    user.value = null
    
    if (process.client) {
      localStorage.removeItem('auth')
    }
  }

  return {
    authenticated,
    user,
    login,
    logout,
    checkAuth
  }
}

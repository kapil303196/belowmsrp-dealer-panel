export const useAuthStore = defineStore('auth', () => {
  // State
  const authenticated = ref(false)
  const user = ref(null)

  // Actions
  function login(email, password) {
    if (email === 'admin@example.com' && password === 'password') {
      authenticated.value = true
      user.value = {
        id: 1,
        email,
        name: 'Admin User',
        role: 'admin',
        // Dealer profile fields for UI compatibility
        dealershipName: 'Demo Dealership',
        employeeName: 'Admin User',
        address: '123 Main St, Springfield, USA',
        licenseNumber: 'DL-000000',
        contactPhone: '(000) 000-0000',
        logoDataUrl: null
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
  
  function logout() {
    authenticated.value = false
    user.value = null
    if (process.client) {
      localStorage.removeItem('auth')
    }
  }
  
  function checkAuth() {
    if (process.client) {
      const auth = localStorage.getItem('auth')
      if (auth) {
        try {
          const authData = JSON.parse(auth)
          authenticated.value = authData.authenticated
          user.value = authData.user
        } catch (e) {
          console.error('Failed to parse auth data from localStorage', e)
        }
      }
    }
  }

  // Getters
  const isAuthenticated = computed(() => authenticated.value)
  const userDetails = computed(() => user.value)

  return {
    authenticated,
    user,
    login,
    logout,
    checkAuth,
    isAuthenticated,
    userDetails
  }
})

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.NUXT_PUBLIC_API_BASE_URL

  const getAuthHeaders = (options = {}) => {
    const { omitContentType = false } = options
    let headers = {}
    if (process.client) {
      const auth = localStorage.getItem('auth')
      if (auth) {
        try {
          const authData = JSON.parse(auth)
          if (authData.user && authData.user.token) {
            headers['authtoken'] = `${authData.user.token}`
          }
        } catch (e) {
          console.error('Failed to parse auth data', e)
        }
      }
    }
    if (!omitContentType) {
      headers['Content-Type'] = 'application/json'
    }
    return headers
  }

  const apiGet = async (endpoint) => {
    try {
      const response = await $fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'GET',
        headers: getAuthHeaders()
      })
      return response
    } catch (error) {
      console.error('API GET Error:', error)
      throw error
    }
  }

  const apiPost = async (endpoint, data) => {
    try {
      const response = await $fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: data
      })
      return response
    } catch (error) {
      console.error('API POST Error:', error)
      throw error
    }
  }

  // For FormData/multipart requests. Avoid setting Content-Type so the browser sets the boundary.
  const apiPostForm = async (endpoint, formData) => {
    try {
      const response = await $fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: getAuthHeaders({ omitContentType: true }),
        body: formData
      })
      return response
    } catch (error) {
      console.error('API POST (form) Error:', error)
      throw error
    }
  }

  const apiPut = async (endpoint, data) => {
    try {
      const response = await $fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: data
      })
      return response
    } catch (error) {
      console.error('API PUT Error:', error)
      throw error
    }
  }

  const apiDelete = async (endpoint) => {
    try {
      const response = await $fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      return response
    } catch (error) {
      console.error('API DELETE Error:', error)
      throw error
    }
  }

  return {
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
    getAuthHeaders,
    apiPostForm
  }
} 
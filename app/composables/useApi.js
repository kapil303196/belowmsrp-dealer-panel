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
      const apiMessage = error.data?.data?.message || 'Something went wrong'
      throw new Error(apiMessage)
    }
  }

  // GET that returns a Blob (e.g., PDF download)
  const apiGetBlob = async (endpoint) => {
    try {
      const response = await $fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'GET',
        headers: getAuthHeaders({ omitContentType: true }),
        responseType: 'arrayBuffer'
      })
      return new Blob([response], { type: 'application/pdf' })
    } catch (error) {
      console.error('API GET (blob) Error:', error)
      const apiMessage = error.data?.data?.message || 'Something went wrong'
      throw new Error(apiMessage)
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
      console.log('API POST Error:', error?.data)
      const apiMessage = error.data?.data?.message || 'Something went wrong'
      throw new Error(apiMessage)
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
      const apiMessage = error.data?.data?.message || 'Something went wrong'
      throw new Error(apiMessage)
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
      const apiMessage = error.data?.data?.message || 'Something went wrong'
      throw new Error(apiMessage)
    }
  }

  const apiPutForm = async (endpoint, formData) => {
    try {
      const response = await $fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'PUT',
        headers: getAuthHeaders({ omitContentType: true }),
        body: formData
      })
      return response
    } catch (error) {
      console.error('API PUT (form) Error:', error)
      const apiMessage = error.data?.data?.message || 'Something went wrong'
      throw new Error(apiMessage)
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
      const apiMessage = error.data?.data?.message || 'Something went wrong'
      throw new Error(apiMessage)
    }
  }

  return {
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
    getAuthHeaders,
    apiPostForm,
    apiPutForm,
    apiGetBlob
  }
} 
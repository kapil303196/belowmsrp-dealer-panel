export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) return
  
  const { checkAuth } = useAuth()
  
  checkAuth()
})

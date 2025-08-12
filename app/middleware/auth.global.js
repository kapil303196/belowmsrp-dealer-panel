export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return
  
  const { authenticated } = useAuth()
  
  if (!authenticated.value && to.path !== '/login' && to.path !== '/signup') {
    return navigateTo('/login')
  }
  
  if (authenticated.value && (to.path === '/login' || to.path === '/signup')) {
    return navigateTo('/')
  }
})

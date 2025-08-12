export default defineNuxtRouteMiddleware((to) => {
  const { $auth } = useNuxtApp()

  if (!$auth.isAuthenticated && to.path !== '/login' && to.path !== '/signup') {
    return navigateTo('/login')
  }

  if ($auth.isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
    return navigateTo('/')
  }
})

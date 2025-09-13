<template>
  <div class="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white max-lg">
    <!-- Left Form Section -->
    <div class="flex flex-col justify-center items-center px-4 py-10 max-lg:pb-0">
      <div class="w-full max-w-[484px]">
        <div class="max-sm:text-center">
          <img class="mb-[70px] max-sm:mx-auto max-sm:mb-5" src="../../assets/images/icons/fav-icon.svg" alt="logo" />
          <h3 class="text-primary-medium mb-3">Login to your account</h3>
          <p class="text-[#A0AEC0] text-sm mb-7 max-sm:mb-5">Enter your credentials to access your account</p>
        </div>
        <form @submit.prevent="handleLogin" class="space-y-[19px]">
          <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {{ errorMessage }}
          </div>

          <div>
            <label class="text-sm font-medium text-on-secondary">Email Address*</label>
            <div class="relative w-full h-[46px] mt-2 border bg-white border-border rounded-lg px-4 pr-10 py-2 outline-secondary">
              <input v-model="email" type="email" placeholder="Enter email address" class="w-full h-full text-sm outline-none" />
              <img src="../../assets/images/icons/at-the-rate.svg" alt="icon" class="absolute top-1/2 right-4 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-on-secondary">Password*</label>
            <div class="relative w-full h-[46px] mt-2 border bg-white border-border rounded-lg px-4 pr-10 py-2 outline-secondary">
              <input v-model="password" type="password" placeholder="Enter password" class="w-full h-full text-sm outline-none" />
              <img src="../../assets/images/icons/eye-password.svg" alt="icon" class="absolute top-1/2 right-4 -translate-y-1/2" />
            </div>
            <div class="text-right mt-2">
              <a href="#" class="text-sm text-secondary font-medium text-right underline">Forgot password?</a>
            </div>
          </div>

          <div class="w-full max-sm:w-fit max-sm:ml-auto max-sm:mr-0">
            <ui-base-button :disabled="isSubmitting" class="w-full justify-center flex items-center gap-3" type="submit" variant="secondary">
              <span v-if="isSubmitting" class="inline-flex items-center">
                <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Logging in...
              </span>
              <span v-else class="inline-flex items-center gap-3">
                Log In
                <img src="../../assets/images/icons/angle-right-white-login.svg" alt="icon" />
              </span>
            </ui-base-button>
          </div>
        </form>
      </div>
      <p class="text-sm text-center mt-10">
        Dont have an account?
        <NuxtLink to="/signup" class="text-secondary font-medium underline">Sign up now</NuxtLink>
      </p>
    </div>

    <!-- Right Info Section -->
    <div class="bg-[#F0F4FA] flex items-center justify-center m-12 p-10 rounded-[40px] max-md:p-3 max-md:m-5 max-sm:p-6">
      <img src="../../assets/images/login-bg.png" alt="Car Trade" class="mb-12 max-sm:mb-0" />
    </div>
  </div>
</template>

<script setup>
// Use our auth composable
const { login } = useAuth();
// Use our API composable
const { apiPost } = useApi();

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isSubmitting = ref(false);
const config = useRuntimeConfig();
const apiBaseUrl = config.public.NUXT_PUBLIC_API_BASE_URL;

//log api url on mount
onMounted(() => {});

const loginApi = async (email, password) => {
  try {
    const response = await apiPost("/auth/dealer-login", {
      email: email,
      password: password,
    });
    return response;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

const handleLogin = async () => {
  // Clear any previous error message
  errorMessage.value = "";

  if (!email.value || !password.value) {
    errorMessage.value = "Please enter both email and password";
    return;
  }

  try {
    isSubmitting.value = true;
    const response = await loginApi(email.value, password.value);

    // Update the auth state
    const { authenticated, user } = useAuth();
    authenticated.value = true;
    user.value = response.data.data;
    // Store in localStorage with the correct key
    localStorage.setItem(
      "auth",
      JSON.stringify({
        authenticated: true,
        user: response.data,
      })
    );

    // Navigate to index page
    navigateTo("/");
  } catch (error) {
    console.error("Login failed:", error);
    errorMessage.value = "Invalid credentials. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Add custom styles or adjust spacing if necessary */
</style>

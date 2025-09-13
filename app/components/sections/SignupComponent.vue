<template>
    <div class="min-h-screen grid grid-cols-1 md:grid-cols-2">
        <!-- Left Form Section -->
        <div class="bg-[#F0F4FA] flex flex-col justify-start items-center px-4 py-10 max-md:px-5">
            <div class="flex flex-col items-center mb-[22px] gap-[22px] max-sm:text-center">
                <img src="../../assets/images/icons/fav-icon.svg" alt="logo">
                <h3 class="text-primary-medium max-md:text-[26px] max-md:font-semibold">Create your Dealer Account</h3>
            </div>
            <div
                class="w-full max-w-[484px] bg-secondary-light border border-[#CAD5E9] rounded-2xl shadow-shadow-light px-6 py-7 max-md:max-w-full">
                <form class="space-y-[19px]" @submit.prevent="handleSubmit">
                    <!-- Dealership Name -->
                    <div class="relative">
                        <label class="text-sm font-medium text-on-secondary">Dealership Name *</label>
                        <div
                            class="relative w-full h-[46px] mt-2 border bg-white border-border rounded-lg px-4 pr-10 py-2 outline-secondary">
                            <input v-model="form.dealershipName" required type="text" placeholder="Enter dealership name"
                                class="w-full h-full text-sm outline-none" />
                        </div>
                    </div>

                    <!-- Employee Name -->
                    <div class="relative">
                        <label class="text-sm font-medium text-on-secondary">Employee Name *</label>
                        <div
                            class="relative w-full h-[46px] mt-2 border bg-white border-border rounded-lg px-4 pr-10 py-2 outline-secondary">
                            <input v-model="form.employeeName" required type="text" placeholder="Enter employee name"
                                class="w-full h-full text-sm outline-none" />
                        </div>
                    </div>

                    <!-- Dealer Logo -->
                    <!-- <div>
                        <label class="text-sm font-medium text-on-secondary">Dealer Logo</label>
                        <div class="mt-2 flex items-center gap-4">
                            <div class="w-[46px] h-[46px] rounded-full overflow-hidden bg-white border border-border flex items-center justify-center">
                                <img v-if="form.logoPreview" :src="form.logoPreview" alt="logo preview" class="w-full h-full object-cover" />
                                <img v-else src="../../assets/images/icons/red-sport-car-logo.svg" alt="default logo" />
                            </div>
                            <input @change="onLogoChange" type="file" accept="image/*"
                                class="text-sm" />
                        </div>
                    </div> -->

                    <!-- Full Address -->
                    <div>
                        <label class="text-sm font-medium text-on-secondary">Full Address *</label>
                        <textarea v-model="form.address" required rows="3" placeholder="Street, City, State, ZIP"
                            class="mt-2 w-full border bg-white border-border rounded-lg px-4 py-2 text-sm outline-secondary"></textarea>
                    </div>

                    <!-- Dealer License Number -->
                    <div>
                        <label class="text-sm font-medium text-on-secondary">Dealer License Number *</label>
                        <input v-model="form.licenseNumber" required type="text" placeholder="Enter license number"
                            class="mt-2 w-full h-[46px] border bg-white border-border rounded-lg px-4 py-2 text-sm outline-secondary" />
                    </div>

                    <!-- Email -->
                    <div>
                        <label class="text-sm font-medium text-on-secondary">Email Address *</label>
                        <div
                            class="relative w-full h-[46px] mt-2 border bg-white border-border rounded-lg px-4 pr-10 py-2 outline-secondary">
                            <input v-model="form.email" required type="email" placeholder="Enter email address"
                                class="w-full h-full text-sm outline-none" />
                            <img src="../../assets/images/icons/at-the-rate.svg" alt="icon"
                                class="absolute top-1/2 right-4 -translate-y-1/2" />
                        </div>
                    </div>

                    <!-- Contact Phone -->
                    <div>
                        <label class="text-sm font-medium text-on-secondary">Contact Phone *</label>
                        <div
                            class="relative w-full h-[46px] mt-2 border bg-white border-border rounded-lg px-4 pr-10 py-2 outline-secondary">
                            <input v-model="form.phone" required type="tel" placeholder="Enter contact phone"
                                class="w-full h-full text-sm outline-none" />
                            <img src="../../assets/images/icons/mobile.svg" alt="icon"
                                class="absolute top-1/2 right-4 -translate-y-1/2" />
                        </div>
                    </div>

                    <!-- Password -->
                    <div>
                        <label class="text-sm font-medium text-on-secondary">Password *</label>
                        <div
                            class="relative w-full h-[46px] mt-2 border bg-white border-border rounded-lg px-4 pr-10 py-2 outline-secondary">
                            <input v-model="form.password" required type="password" placeholder="Enter password"
                                class="w-full h-full text-sm outline-none" />
                            <img src="../../assets/images/icons/eye-password.svg" alt="icon"
                                class="absolute top-1/2 right-4 -translate-y-1/2" />
                        </div>
                    </div>

                    <div class="w-full flex justify-end">
                        <ui-base-button :disabled="isSubmitting" type="submit" variant="secondary">
                            <span v-if="isSubmitting" class="inline-flex items-center">
                                <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                                Submitting...
                            </span>
                            <span v-else>Sign Up Now</span>
                        </ui-base-button>
                    </div>
                </form>
            </div>
            <p class="text-sm text-center mt-4">Already have an account?
                <NuxtLink to="/login" class="text-secondary font-medium">Log in</NuxtLink>
            </p>
        </div>

        <!-- Right Info Section (Dealer-focused) -->
        <div class="bg-white flex flex-col items-start pt-[130px] pl-[130px] max-lg:px-10 max-lg:items-center max-md:p-5 max-sm:py-20">
            <!-- <img src="../../assets/images/user-2.png" alt="Dealership" class="mb-12" /> -->
            <div class="max-w-[377px] w-full text-left">
                <h2 class="mb-4">Why join Below MSRP?</h2>
                <p class="text-primary-light mb-4">Tools built for dealerships to close more deals, faster.</p>
                <span class="w-[258px] h-[1px] bg-gray-200 block mb-9"></span>
                <ul class="mb-6 text-lg font-semibold text-on-primary space-y-[14px]">
                    <li class="flex items-center gap-3">
                        <img src="../../assets/images/icons/circle-check.svg" alt="icon">
                        Centralize and manage all offers
                    </li>
                    <li class="flex items-center gap-3">
                        <img src="../../assets/images/icons/circle-check.svg" alt="icon">
                        Real-time analytics on accepted/countered/rejected
                    </li>
                    <li class="flex items-center gap-3">
                        <img src="../../assets/images/icons/circle-check.svg" alt="icon">
                        Team access for employees
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
const isSubmitting = ref(false)
const router = useRouter()
const { authenticated, user } = useAuth()
const { apiPost } = useApi()

const form = reactive({
    dealershipName: '',
    employeeName: '',
    logoFile: null,
    logoPreview: '',
    address: '',
    licenseNumber: '',
    email: '',
    phone: '',
    password: ''
})

function onLogoChange(e) {
    const file = e?.target?.files?.[0]
    if (!file) return
    form.logoFile = file
    const reader = new FileReader()
    reader.onload = () => {
        form.logoPreview = reader.result
    }
    reader.readAsDataURL(file)
}

async function handleSubmit() {
    if (isSubmitting.value) return
    isSubmitting.value = true
    try {
        // Minimal client-side validation
        if (!form.dealershipName || !form.employeeName || !form.address || !form.licenseNumber || !form.email || !form.phone || !form.password) {
            throw new Error('Please fill in all required fields.')
        }

        const payload = {
            role: 'dealer',
            dealershipName: form.dealershipName,
            employeeName: form.employeeName,
            address: form.address,
            licenseNumber: form.licenseNumber,
            email: form.email,
            contactPhone: form.phone,
            logoDataUrl: form.logoPreview || null,
            password: form.password
        }

        const response = await apiPost('/auth/dealer-signup', payload)

        // Try to extract user and token from various common response shapes
        const responseUser = response?.user ?? response
        const responseToken = response?.token ?? response?.user?.token

        if (responseToken) {
            authenticated.value = true
            user.value = { ...responseUser, token: responseToken }
            if (process.client) {
                localStorage.setItem('auth', JSON.stringify({ authenticated: true, user: user.value }))
            }
            router.push('/')
        } else {
            alert('Signup successful. Please log in to continue.')
            router.push('/login')
        }
    } catch (err) {
        console.error(err)
        const apiMessage = err?.data?.message || err?.message || 'Failed to sign up. Please try again.'
        alert(apiMessage)
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped>
/* Add custom styles or adjust spacing if necessary */
</style>

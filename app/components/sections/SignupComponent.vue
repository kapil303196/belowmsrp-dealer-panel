<template>
    <div class="min-h-screen grid grid-cols-1 md:grid-cols-2">
        <!-- Left Form Section -->
        <div class="bg-[#F0F4FA] flex flex-col justify-start items-center px-4 py-10 max-md:px-5">
            <div class="flex flex-col items-center mb-[22px] gap-[22px] max-sm:text-center">
                <img src="../../assets/images/icons/fav-icon.svg" alt="logo">
                <h3 class="text-primary-medium max-md:text-[26px] max-md:font-semibold">Create your Below Msrp Account</h3>
            </div>
            <div
                class="w-full max-w-[484px] bg-secondary-light border border-[#CAD5E9] rounded-2xl shadow-shadow-light px-6 py-7 max-md:max-w-full">
                <form class="space-y-[19px]">
                    <div class="relative">
                        <label class="text-sm font-medium text-on-secondary">Full Name *</label>
                        <div
                            class="relative w-full h-[46px] mt-2  border bg-white border-border rounded-lg px-4 pr-10 py-2 outline-secondary">
                            <input type="text" placeholder="Enter full name"
                                class="w-full h-full text-sm outline-none" />
                            <img src="../../assets/images/icons/profile-avatar.svg" alt="icon"
                                class="absolute top-1/2 right-4  -translate-y-1/2" />
                        </div>
                    </div>

                    <div>
                        <label class="text-sm font-medium text-gray-700">Your City *</label>
                        <div
                            class="relative w-full h-[46px] mt-2  border bg-white border-border rounded-lg px-4 pr-[18px] py-2 outline-secondary">
                            <select class="text-primary-light w-full h-full text-sm outline-none">
                                <option>Select city</option>
                                <option>New York</option>
                                <option>Los Angeles</option>
                                <option>Chicago</option>
                            </select>
                        </div>

                    </div>

                    <div>
                        <label class="text-sm font-medium text-on-secondary">Phone Number *</label>
                        <div
                            class="relative w-full h-[46px] mt-2  border bg-white border-border rounded-lg px-4 pr-10 py-2 outline-secondary">
                            <input type="text" placeholder="Enter phone number"
                                class="w-full h-full text-sm outline-none" />
                            <img src="../../assets/images/icons/mobile.svg" alt="icon"
                                class="absolute top-1/2 right-4  -translate-y-1/2" />
                        </div>
                        <p class="text-xs text-on-secondary mt-1">Number will not be shared with an dealership</p>
                    </div>

                    <div>
                        <label class="text-sm font-medium text-on-secondary">Email Address*</label>
                        <div
                            class="relative w-full h-[46px] mt-2  border bg-white border-border rounded-lg px-4 pr-10 py-2 outline-secondary">
                            <input type="email" placeholder="Enter email address"
                                class="w-full h-full text-sm outline-none" />
                            <img src="../../assets/images/icons/at-the-rate.svg" alt="icon"
                                class="absolute top-1/2 right-4  -translate-y-1/2" />
                        </div>

                    </div>

                    <div>
                        <label class="text-sm font-medium text-on-secondary">Password*</label>

                        <div
                            class="relative w-full h-[46px] mt-2  border bg-white border-border rounded-lg px-4 pr-10 py-2 outline-secondary">
                            <input type="password" placeholder="Enter password"
                                class="w-full h-full text-sm outline-none" />
                            <img src="../../assets/images/icons/eye-password.svg" alt="icon"
                                class="absolute top-1/2 right-4  -translate-y-1/2" />
                        </div>

                    </div>

                    <div>
                        <label class="text-sm font-medium text-on-secondary">Credit Score</label>
                        <input type="text" placeholder="Enter score"
                            class="mt-2 w-full h-[46px] border bg-white border-border rounded-lg px-4 py-2 text-sm outline-secondary" />
                    </div>

                    <div>
                        <div class="text-sm font-medium text-on-secondary">Would you finance with a dealership?</div>
                        <div class="flex items-center gap-10 text-sm mt-[14px] text-on-secondary">
                            <label class="flex items-center">
                                <input type="radio" name="finance" class="mr-2" /> Yes
                            </label>
                            <label class="flex items-center">
                                <input type="radio" name="finance" class="mr-2" /> No
                            </label>
                        </div>
                    </div>
                    <div class="w-full flex justify-end">
                        <ui-base-button type="submit" variant="secondary">
                            Sign Up Now
                        </ui-base-button>
                    </div>
                </form>
            </div>
            <p class="text-sm text-center mt-4">Already have account?
                <a href="#" class="text-secondary font-medium">Log in</a>
            </p>
        </div>

        <!-- Right Info Section -->
        <div class="bg-white flex flex-col  items-start pt-[130px] pl-[130px] max-lg:px-10 max-lg:items-center max-md:p-5 max-sm:py-20">
            <img src="../../assets/images/man-with-car.png" alt="Car Trade" class="mb-12" />
            <div class="max-w-[377px] w-full text-left">
                <h2 class="mb-4">Will you be trading in a car?</h2>
                <p class="text-primary-light mb-4">Are You Planning to Trade In Your Current Vehicle for a New One?</p>
                <span class="w-[258px] h-[1px] bg-gray-200 block mb-9"></span>
                <ul class="mb-6 text-lg font-semibold text-on-primary space-y-[14px]">
                    <li class="text-primary-light font-medium">If so then enter the </li>
                    <li class="flex items-center gap-3">
                        <img src="../../assets/images/icons/circle-check.svg" alt="icon">
                        Car VIN number
                    </li>
                    <li class="flex items-center gap-3">
                        <img src="../../assets/images/icons/circle-check.svg" alt="icon">
                        Car condition
                    </li>
                    <li class="flex items-center gap-3">
                        <img src="../../assets/images/icons/circle-check.svg" alt="icon">
                        Car mileage.
                    </li>
                </ul>
                <ui-base-button variant="secondary" class="flex items-center gap-2">
                    Enter Car Details
                    <img src="../../assets/images/icons/angle-right-white.svg" alt="icon">
                </ui-base-button>
            </div>
        </div>
    </div>
</template>

<script setup>
// Add form handling logic or validation here if needed
</script>

<style scoped>
/* Add custom styles or adjust spacing if necessary */
</style>

<template>
    <Teleport to="body">
        <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="isOpen"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                @click="handleBackdropClick">
                <div class="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden transform transition-all"
                    @click.stop>
                    <!-- Header -->
                    <div class="p-6 pb-0">
                        <div class="flex items-start gap-4">
                            <div
                                :class="['flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center', type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600']">
                                <svg v-if="type === 'danger'" class="w-6 h-6" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
                                <p class="mt-2 text-sm text-gray-500">{{ message }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="p-6 flex items-center justify-end gap-3">
                        <button type="button" @click="$emit('cancel')"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            {{ cancelText }}
                        </button>
                        <button type="button" @click="$emit('confirm')"
                            :class="['px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2', type === 'danger' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-secondary hover:bg-secondary/90 focus:ring-secondary']">
                            {{ confirmText }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: 'Confirm Action'
    },
    message: {
        type: String,
        default: 'Are you sure you want to proceed?'
    },
    confirmText: {
        type: String,
        default: 'Confirm'
    },
    cancelText: {
        type: String,
        default: 'Cancel'
    },
    type: {
        type: String,
        default: 'info', // 'info' | 'danger'
        validator: (value) => ['info', 'danger'].includes(value)
    }
});

const emit = defineEmits(['confirm', 'cancel']);

const handleBackdropClick = () => {
    emit('cancel');
};
</script>

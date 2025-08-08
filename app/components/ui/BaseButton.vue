<template>
    <button :class="[
        'px-6 py-[16px] font-semibold rounded-xl transition-all duration-200 text-[16px] h-[54px] inline-flex',
        {
            'bg-primary text-white hover:bg-primary': variant === 'primary',
            'bg-secondary text-white hover:bg-secondary': variant === 'secondary',
        }
    ]">
        <slot />
    </button>
</template>

<script setup lang="ts">
defineProps({
    variant: {
        type: String,
        default: 'primary' // or 'secondary', 'accent', etc.
    }
})
</script>

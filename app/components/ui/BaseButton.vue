<template>
    <button :type="type"
            :class="[
        'px-6 py-[16px] font-semibold rounded-lg transition-all duration-200 text-[16px] h-[54px] inline-flex items-center justify-center',
        {
            'bg-primary text-white border border-primary hover:bg-transparent hover:text-primary': variant === 'primary',
            'bg-secondary text-white border border-secondary hover:bg-transparent hover:text-secondary': variant === 'secondary',
            'bg-[#2C8436] text-white border border-[#2C8436] hover:bg-transparent hover:text-[#2C8436]': variant === 'green',
            'bg-[#D53660] text-white border border-[#D53660] hover:bg-transparent hover:text-[#D53660]': variant === 'red',

            'bg-transparent text-primary border border-primary hover:bg-primary hover:text-white': variant === 'primary-transparent',
            'bg-transparent text-secondary border border-secondary hover:bg-secondary hover:text-white': variant === 'secondary-transparent',
            'bg-transparent text-[#2C8436] border border-[#2C8436] hover:bg-[#2C8436] hover:text-white': variant === 'green-transparent',
            'bg-transparent text-[#D53660] border border-[#D53660] hover:bg-[#D53660] hover:text-white': variant === 'red-transparent',
        }
    ]">
        <slot />
    </button>
</template>

<script setup lang="ts">
type ButtonType = 'submit' | 'button' | 'reset';

const props = withDefaults(defineProps<{
    variant?: string;
    type?: ButtonType;
}>(), {
    variant: 'primary',
    type: 'submit'
});
</script>

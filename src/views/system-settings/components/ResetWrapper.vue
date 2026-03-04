<template>
  <div class="w-full flex items-center gap-2">
    <slot />

    <n-button @click="handleReset"> 默认值 </n-button>
  </div>
</template>

<script setup>
const props = defineProps({
  originalValue: {
    type: [String, Number, Boolean],
    required: true,
  },
})

const emit = defineEmits(['reset'])

const modelValue = defineModel({
  type: [String, Number, Boolean],
})

const handleReset = () => {
  modelValue.value = props.originalValue
  emit('reset')
}
</script>

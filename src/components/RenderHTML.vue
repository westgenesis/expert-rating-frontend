<template>
  <n-ellipsis
    :tooltip="{
      placement: 'top',

      'content-class': 'max-h-80 max-w-[800px]',
      scrollable: true,
    }"
  >
    {{ plainText }}

    <template #tooltip>
      <div v-html="html"></div>
    </template>
  </n-ellipsis>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  html: {
    type: String,
    default: '',
  },
})

const plainText = computed(() => {
  return props.html.replace(/<[^>]+>/g, '')
})
</script>

<style></style>

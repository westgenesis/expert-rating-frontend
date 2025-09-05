<template>
  <article
    class="markdown-body border border-solid border-gray-200 rounded-sm mt-4! p-4"
    v-html="compiled"
  ></article>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import 'github-markdown-css'

const props = defineProps({
  md: {
    type: String,
    default: '',
  },
})

const compiled = computed(() => marked(props.md))
</script>

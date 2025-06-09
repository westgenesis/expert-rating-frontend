<template>
  <div class="flex flex-col h-screen bg-white">
    <Header />
    <Content />
  </div>
</template>

<script setup>
import Header from './Header.vue'
import Content from './Content.vue'

defineOptions({
  name: 'PageLayout',
})
</script>

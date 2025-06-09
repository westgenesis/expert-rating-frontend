<template>
  <section class="flex flex-col gap-8">
    <RatingMatrix />
    <RatingHistory />
  </section>
</template>

<script setup>
import RatingMatrix from './components/RatingMatrix/index.vue'
import RatingHistory from './components/RatingHistory.vue'
defineOptions({
  name: 'RatingSettings',
})
</script>

<template>
  <section class="flex flex-col gap-8">
    <ExpertRatingMatrix />

    <ObjectiveRatingMatrix />

    <RatingHistory />
  </section>
</template>

<script setup>
import { ExpertRatingMatrix, ObjectiveRatingMatrix } from './components/RatingMatrix'
import RatingHistory from './components/RatingHistory.vue'
defineOptions({
  name: 'RatingSettings',
})
</script>

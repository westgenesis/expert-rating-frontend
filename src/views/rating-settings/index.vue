<template>
  <section class="flex flex-col gap-8">
    <Coefficient />

    <ExpertRatingMatrix />

    <ObjectiveRatingMatrix />

    <ExpertList />

    <RatingHistory />
  </section>
</template>

<script setup>
import Coefficient from './components/Coefficient.vue'
import { ExpertRatingMatrix, ObjectiveRatingMatrix } from './components/RatingMatrix'
import ExpertList from './components/ExpertList.vue'
import RatingHistory from './components/RatingHistory.vue'
defineOptions({
  name: 'RatingSettings',
})
</script>

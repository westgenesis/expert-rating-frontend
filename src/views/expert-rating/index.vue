<template>
  <section>
    <RatingObjInfo :data="ratingObj" />
    <TestResult />
    <RatingForm class="mt-4"/>
  </section>
</template>

<script setup>
import RatingObjInfo from './components/RatingObjInfo.vue'
import TestResult from './components/TestResult/index.vue'
import RatingForm from './components/RatingForm/index.vue'

import useRatingObj from '@/hooks/useRatingObj'

defineOptions({
  name: 'ExpertRating',
})

const ratingObj = useRatingObj()


</script>

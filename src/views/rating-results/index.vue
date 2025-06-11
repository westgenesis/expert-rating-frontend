<template>
  <section>
    <RatingObjInfo :data="ratingObj" />
    <RatingOverview />

    <div class="my-4 flex justify-between items-stretch gap-4">
      <ExecutionStatistics class="flex-1/3" />
      <DefectDistributionStatistics class="flex-2/3" />
    </div>

    <RatingHistory />

    <div class="my-4 flex justify-end gap-2">
      <ConfirmResult />
      <InviteExpertRating />
    </div>
  </section>
</template>

<script setup>
import RatingObjInfo from '@/views/expert-rating/components/RatingObjInfo.vue'
import RatingOverview from './components/RatingOverview/index.vue'
import ExecutionStatistics from '@/views/expert-rating/components/TestResult/ExecutionStatistics.vue'
import DefectDistributionStatistics from '@/views/expert-rating/components/TestResult/DefectDistributionStatistics.vue'
import RatingHistory from './components/RatingHistory.vue'

import ConfirmResult from './components/ConfirmResult.vue'
import InviteExpertRating from './components/InviteExpertRating.vue'

import useRatingObj from '@/hooks/useRatingObj'

const ratingObj = useRatingObj()
defineOptions({
  name: 'RatingResults',
})
</script>

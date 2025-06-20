<template>
  <div class="px-4 relative flex flex-col items-center">
    <svg width="200" height="200" viewBox="0 0 200 200">
      <path
        d="M 169.28 140.00 A 80 80 0 1 0 30.72 140.00"
        :stroke="scoreColor"
        stroke-width="10"
        fill="none"
      />
    </svg>

    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div class="text-center text-lg font-bold text-slate-700">综合得分</div>
      <div class="text-center text-2xl font-bold mt-2" :style="{ color: scoreColor }">
        {{ score ? score.toFixed(2) : '--' }}
      </div>
    </div>

    <div class="relative flex justify-center -mt-8 w-4/5">
      <div
        class="arrow absolute top-0 -translate-x-1/2 -translate-y-full -mt-1"
        :style="{
          borderTopColor: scoreColor,
          left: `${arrowPercent}%`,
        }"
      ></div>
      <div
        class="w-1/5 h-2"
        v-for="(item, index) in [...SCORE_COLORS].reverse()"
        :key="index"
        :style="{ background: item.color }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  score: {
    type: Number,
    default: 0,
  },
})

const SCORE_COLORS = [
  { score: 100, color: '#81D3F8' },
  { score: 90, color: '#80FFFE' },
  { score: 80, color: '#C9F982' },
  { score: 70, color: '#FACD91' },
  { score: 60, color: '#EC7F8C' },
]

const scoreColor = computed(() => {
  let showColor = '#81D3F8'
  for (let item of SCORE_COLORS) {
    const { score, color } = item
    if (props.score <= score) {
      showColor = color
    } else {
      break
    }
  }

  return showColor
})

const arrowPercent = computed(() => {
  const scores = SCORE_COLORS.map((item) => item.score)
  const max = Math.max(...scores)
  const min = Math.min(...scores) - 10
  const range = max - min
  return Math.max(0, ((props.score - min) / range) * 100)
})
</script>

<style lang="scss" scoped>
.arrow {
  width: 0;
  height: 0;
  border-top: 6px solid #999;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
}
</style>

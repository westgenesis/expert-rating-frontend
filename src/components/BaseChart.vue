<template>
  <v-chart class="chart" :option="option" />
</template>

<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, TitleComponent, TooltipComponent, LegendComponent])

defineProps({
  option: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.chart {
  height: 200px;
}
</style>

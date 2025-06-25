<template>
  <BaseChart :option="realOption" />
</template>

<script setup>
import { PieChart } from 'echarts/charts'
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'
import { merge, clone } from 'lodash'
import { use } from 'echarts/core'

use([PieChart])
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  getItemStyle: {
    type: Function,
  },
  option: {
    type: Object,
    default: () => ({}),
  },
})

const baseOption = computed(() => {
  return {
    legend: {
      orient: 'vertical',
      left: 'right',
      top: 'center',
      icon: 'circle',
      align: 'left',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 20,
      textStyle: {
        width: 100,
        overflow: 'truncate',
        fontSize: 12,
        color: '#333',
      },
      type: 'scroll',
      formatter: (name) => {
        const item = Object.entries(props.data).find(([key]) => key === name)
        if (!item) return name
        const [label, value] = item
        const text = `${label} (${value})`
        const max = 10
        return text.length > max ? text.slice(0, max) + '...' : text
      },
      tooltip: {
        show: true,
      },
    },
    series: [
      {
        type: 'pie',
        radius: '90%',
        center: ['30%', '50%'],
        data: Object.keys(props.data).map((key) => {
          const value = props.data[key]
          return {
            name: key,
            value,
            itemStyle: props.getItemStyle ? props.getItemStyle(key, value) : {},
            label: { show: value !== 0 },
            labelLine: { show: value !== 0 },
          }
        }),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },

        labelLine: {
          show: false,
        },

        label: {
          show: true,
          position: 'inside', // 图形内部
          formatter: '{d}%', // 显示百分比，可换成 `{b}: {c}` 显示名称+数值
        },
      },
    ],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
  }
})

const realOption = computed(() => merge(clone(baseOption.value), props.option || {}))
</script>

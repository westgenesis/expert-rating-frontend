<template>
  <div>
    <n-card title="缺陷分布统计">
      <div class="flex gap-4">
        <div class="flex-1 shadow-sm p-4">
          <div class="text-md text-center font-semibold">缺陷严重程度分布</div>
          <PieChart :data="data" />
        </div>

        <div class="flex-1 shadow-sm p-4">
          <div class="text-md text-center font-semibold">缺陷严重程度分布</div>
          <PieChart :data="data2" />
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PieChart from '@/components/PieChart.vue'
const data = ref({
  致命: 62,
  严重: 28,
  一般: 32,
  轻微: 28,
})

const data2 = ref({
  ACC切入: 62,
  ACC切出: 62,
  ACC跟车: 62,
  ACC跟车加速: 62,
  ACC跟车减速: 62,
  ACC被动退出: 62,
  ACC停车: 62,
})
</script>

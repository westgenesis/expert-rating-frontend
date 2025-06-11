<template>
  <div>
    <div
      class="w-fit flex items-center justify-center font-bold border px-4 py-2 text-xl mb-4 rounded-sm"
      :class="status ? 'text-slate-700 border-green-500 bg-[#EBF4E1]' : 'text-red-400'"
    >
      <n-icon class="mr-3" :class="status ? 'text-green-600' : 'text-red-400'">
        <CheckmarkFilled v-if="status" />
        <CloseFilled v-else />
      </n-icon>
      {{ statusInfo.desc }}
    </div>
    <div>
      <dl class="text-gray-500">
        <dt class="font-bold mb-2">判定依据</dt>
        <dd class="item leading-5 px-8" v-for="item in statusInfo.basis" :key="item">
          {{ item }}
        </dd>
      </dl>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CheckmarkFilled, CloseFilled } from '@vicons/carbon'
const props = defineProps({
  status: {
    type: Boolean,
    default: false,
    required: true,
  },
})

const statusDescMap = [
  {
    status: true,
    desc: '测试通过',
    basis: ['未发现A类缺陷', '高级用例执行通过率=100%', '综合评分>=90'],
  },
  {
    status: false,
    desc: '测试未通过',
    basis: ['发现A类缺陷', '高级用例执行通过率<100%', '综合评分<90'],
  },
]

const statusInfo = computed(() => {
  return statusDescMap.find((item) => item.status === props.status)
})
</script>

<style scoped lang="scss">
.item {
  display: flex;
  align-items: center;
  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #999;
    display: inline-block;
    margin-right: 5px;
  }
}
</style>

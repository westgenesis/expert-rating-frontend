<template>
  <div class="border border-gray-300 rounded-sm p-2">
    <div v-if="data.length">
      <div
        class="pointer px-4 py-2 rounded-sm text-sm cursor-pointer flex items-center gap-2 hover:bg-[#0c54fddb] hover:text-white mb-2 transition-colors"
        :class="{ 'bg-[#0C53FD] text-white': model === '' }"
        @click="handleClick('')"
      >
        <n-icon size="20">
          <Folder />
        </n-icon>
        全部 ({{ allCount }})
      </div>

      <div class="pl-4 flex flex-col gap-2">
        <div
          class="pointer px-4 py-2 rounded-sm text-sm cursor-pointer flex items-center gap-2 hover:bg-[#0c54fddb] hover:text-white transition-colors"
          :class="{ 'bg-[#0C53FD] text-white': model === item.type }"
          @click="handleClick(item.type)"
          v-for="(item, index) in data"
          :key="index"
        >
          <n-icon size="20">
            <Grid />
          </n-icon>
          {{ item.name }} ({{ allCount }})
        </div>
      </div>
    </div>

    <div v-else class="h-full flex items-center justify-center">
      <n-empty size="huge" description="暂无数据"></n-empty>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Folder, Grid } from '@vicons/carbon'

defineOptions({
  name: 'TestSet',
})

const props = defineProps({
  data: {
    type: Array,
    default: () => [
      {
        name: '车库测试集合',
        count: 623,
        type: 1,
      },
      {
        name: '车库测试集合',
        count: 623,
        type: 2,
      },
      {
        name: '车库测试集合',
        count: 1623,
        type: 3,
      },
    ],
  },
})

const model = defineModel()

const allCount = computed(() => props.data.reduce((total, item) => total + item.count, 0))

const handleClick = (type) => {
  model.value = type
}
</script>

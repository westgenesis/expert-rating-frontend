<template>
  <div class="border border-gray-300 rounded-sm p-2 overflow-auto">
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
          :class="{ 'bg-[#0C53FD] text-white': model === item['用例ID'] }"
          @click="handleClick(item['用例ID'])"
          v-for="(item, index) in data"
          :key="index"
        >
          <n-icon size="20">
            <Grid />
          </n-icon>
          <n-ellipsis style="max-width: 240px">
            {{ item['用例ID'] }}
          </n-ellipsis>
          ({{ item['测试用例数'] }})
        </div>
      </div>
    </div>

    <div v-else class="h-full flex items-center justify-center">
      <n-empty size="huge" description="暂无数据"></n-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Folder, Grid } from '@vicons/carbon'

import { getTapGetTestsetByDataId } from '@/services/apis'

defineOptions({
  name: 'TestSet',
})

const props = defineProps({
  dataId: {
    type: String,
    required: true,
  },
})

const data = ref([])

const model = defineModel()

const allCount = computed(() => data.value.reduce((total, item) => total + item['测试用例数'], 0))

const handleClick = (type) => {
  model.value = type
}

const getTestSet = async () => {
  if (!props.dataId) {
    return
  }
  const response = await getTapGetTestsetByDataId({
    data_id: props.dataId,
  })
  const testSet = response?.data?.[0]?.['用例组'] || {}
  data.value = Object.keys(testSet).map((key) => ({
    用例ID: key,
    测试用例数: testSet[key]?.['用例数'],
  }))
}

onMounted(() => {
  getTestSet()
})
</script>

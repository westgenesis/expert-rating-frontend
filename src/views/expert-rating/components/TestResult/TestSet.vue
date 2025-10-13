<template>
  <n-tabs type="line" v-model:value="model">
    <n-tab name="">
      <n-icon size="20" class="mr-1"> <Folder /> </n-icon>全部 ({{ allCount }})
    </n-tab>
    <n-tab :name="item.id" v-for="(item, index) in data" :key="index">
      <n-icon size="20" class="mr-1">
        <Grid />
      </n-icon>
      <n-ellipsis style="max-width: 240px">
        {{ item.name }}
      </n-ellipsis>
      ({{ item.count }})
    </n-tab>
  </n-tabs>
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

const allCount = computed(() => data.value.reduce((total, item) => total + item.count, 0))

const getTestSet = async () => {
  if (!props.dataId) {
    return
  }
  const response = await getTapGetTestsetByDataId({
    data_id: props.dataId,
  })
  const testSet = response?.data?.[0]?.['用例组'] || {}
  data.value = Object.keys(testSet).map((key) => ({
    name: testSet[key]?.['用例名字'] || key,
    id: key,
    count: testSet[key]?.['用例数'],
  }))
}

onMounted(() => {
  getTestSet()
})
</script>

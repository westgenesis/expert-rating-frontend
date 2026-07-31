<template>
  <n-card size="small" title="迭代用例推荐">
    <template #header-extra v-if="recommend">
      <n-button size="small" @click="getRecommend" :loading="loading">重新获取推荐</n-button>
    </template>
    <n-spin :show="loading" :delay="1000">
      <template #description> 推荐用例生成中，可能耗时较长，请耐心等待... </template>
      <template v-if="!!recommend || loading">
        <n-data-table :columns="columns" :data="data" :style="{ height: '300px' }" flex-height />
        <MarkdownPreview :md="llmSummarize" v-if="llmSummarize" />
      </template>

      <n-empty description="暂未获取推荐用例" v-else>
        <template #extra>
          <n-button size="small" @click="getRecommend">点击获取</n-button>
        </template>
      </n-empty>
    </n-spin>
  </n-card>
</template>

<script setup lang="jsx">
import { ref, computed, onMounted } from 'vue'
import { postTestcaseRecommend, getTestcaseRecommend } from '@/services/apis'
import MarkdownPreview from '@/components/MarkdownPreview.vue'
import { recommendColumns, toDataTableColumns } from '../report-schema'

const props = defineProps({
  dataId: {
    type: String,
    default: '',
  },
})

const recommend = ref(null)

const data = computed(() => {
  return recommend.value?.defect_related || []
})

const llmSummarize = computed(() => {
  return recommend.value?.llm_summarize || ''
})

/** 列定义与 PDF 导出共用 */
const columns = toDataTableColumns(recommendColumns)

const loading = ref(false)

/**
 * 重新触发大模型生成迭代用例推荐
 * @returns {Promise<void>}
 */
const getRecommend = async () => {
  loading.value = true
  const response = await postTestcaseRecommend({
    data_id: props.dataId,
  })
  recommend.value = response?.data || null
  loading.value = false
}

/**
 * 查询已生成的推荐结果，无结果时保持空态
 * @returns {Promise<void>}
 */
const getHistoryRecommend = async () => {
  const response = await getTestcaseRecommend({
    data_id: props.dataId,
  })

  if (Object.keys(response?.data || {}).length) {
    recommend.value = response?.data
  }
}

onMounted(() => {
  getHistoryRecommend()
})
</script>

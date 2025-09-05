<template>
  <n-card size="small" title="迭代用例推荐">
    <n-spin :show="loading" :delay="1000">
      <template #description> 努力生成中，请稍后... </template>
      <template v-if="!!recommend || loading">
        <n-data-table :columns="columns" :data="data" :style="{ height: '300px' }" flex-height />
        <MarkdownPreview :md="llmSummarize" />
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
import { ref, computed } from 'vue'
import { postTestcaseRecommend } from '@/services/apis'
import MarkdownPreview from '@/components/MarkdownPreview.vue'

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

const columns = ref([
  // 评分专家 评分 更新时间 备注
  {
    title: '用例编号',
    key: '用例编号',
  },
  {
    title: '用例名称',
    key: '用例名称',
  },
  {
    title: '前置条件',
    key: '前置条件',
  },
  {
    title: '测试优先级',
    key: '测试优先级',
  },
  {
    title: '测试描述',
    key: '测试描述',
  },
])

const loading = ref(false)

const getRecommend = async () => {
  loading.value = true
  const response = await postTestcaseRecommend({
    data_id: props.dataId,
  })
  recommend.value = response?.data || []
  loading.value = false
}
</script>

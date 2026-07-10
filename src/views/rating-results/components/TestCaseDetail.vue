<template>
  <div>
    <h3 class="text-[15px] font-semibold text-slate-700 mt-5 mb-3">测试用例明细</h3>
    <n-data-table :columns="columns" :data="testcases" :single-line="false" size="small" />

    <!-- 分页 -->
    <div class="flex justify-end py-3">
      <n-pagination
        v-model:page="page"
        :page-size="pageSize"
        :item-count="total"
        @update:page="fetchTestcases"
      />
    </div>
  </div>
</template>

<script setup lang="jsx">
import { ref, onMounted } from 'vue'
import { getReportTestcases } from '@/services/apis'

defineOptions({
  name: 'TestCaseDetail',
})

const props = defineProps({
  dataId: { type: String, required: true },
})

const page = ref(1)
const pageSize = ref(200)
const total = ref(0)
const testcases = ref([])

/** n-data-table 列定义 */
const columns = [
  {
    title: '用例编号',
    key: 'testcase_number',
    width: 130,
    render: (row) => row.testcase_number || row.testcase_id || '--',
  },
  { title: '用例名称', key: 'testcase_name', ellipsis: { tooltip: true } },
  { title: '测试类型', key: 'testcase_type', width: 100 },
  { title: '优先级', key: 'priority', width: 90 },
  { title: '描述信息', key: 'description', ellipsis: { tooltip: true } },
  {
    title: '逻辑用例',
    key: 'logical_cases',
    ellipsis: { tooltip: true },
    render: (row) => (row.logical_cases || []).map((item) => item.ctcNum).join('；') || '--',
  },
  {
    title: '测试步骤',
    key: 'steps',
    ellipsis: { tooltip: true },
    render: (row) => formatSteps(row.steps),
  },
  {
    title: '预期结果',
    key: 'expected_results',
    ellipsis: { tooltip: true },
    render: (row) => (row.expected_results || []).join('\n') || '--',
  },
]

const fetchTestcases = async () => {
  if (!props.dataId) return
  try {
    const { data } = await getReportTestcases({
      data_id: props.dataId,
      page: page.value,
      page_size: pageSize.value,
    })
    testcases.value = data?.data || []
    total.value = data?.total || 0
  } catch (err) {
    console.error('获取测试用例列表失败:', err)
    testcases.value = []
  }
}

const formatSteps = (steps) => {
  if (!steps || !steps.length) return '--'
  return steps
    .sort((a, b) => (parseInt(a.order, 10) || 0) - (parseInt(b.order, 10) || 0))
    .map((s) => s.action)
    .join('\n')
}

onMounted(() => {
  fetchTestcases()
})
</script>

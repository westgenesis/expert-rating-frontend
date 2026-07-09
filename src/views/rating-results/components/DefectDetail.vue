<template>
  <div>
    <h3 class="text-[15px] font-semibold text-slate-700 mt-5 mb-3">缺陷明细清单</h3>
    <n-data-table :columns="columns" :data="defects" :single-line="false" size="small" />

    <div class="flex justify-end py-3">
      <n-pagination
        v-model:page="page"
        :page-size="pageSize"
        :item-count="total"
        @update:page="fetchDefects"
      />
    </div>
  </div>
</template>

<script setup lang="jsx">
import { ref, onMounted } from 'vue'
import { getReportDefects } from '@/services/apis'

defineOptions({ name: 'DefectDetail' })

const props = defineProps({ dataId: { type: String, required: true } })

const page = ref(1)
const pageSize = ref(200)
const total = ref(0)
const defects = ref([])

const severityTypeMap = { A: 'error', B: 'warning', C: 'info', D: 'success' }

const columns = [
  { title: '所属测试集', key: 'testsuite_names',
    render: (row) => joinArr(row.testsuite_names) },
  { title: '缺陷编号', key: 'bug_id', width: 110 },
  { title: '关联用例编号', key: 'associated_testcase_ids',
    render: (row) => joinArr(row.associated_testcase_ids) },
  { title: '缺陷描述', key: 'title', ellipsis: { tooltip: true } },
  { title: '严重程度', key: 'severity', width: 90,
    render: (row) => row.severity
      ? <n-tag bordered={false} size="tiny" type={severityTypeMap[row.severity] || 'default'}>{row.severity}</n-tag>
      : '--' },
  { title: '发生频率', key: 'frequency', width: 90 },
  { title: '缺陷场景', key: 'defect_scenario', width: 110 },
  { title: '复现步骤', key: 'reproduction_steps', ellipsis: { tooltip: true } },
]

const fetchDefects = async () => {
  if (!props.dataId) return
  try {
    const { data } = await getReportDefects({
      data_id: props.dataId, page: page.value, page_size: pageSize.value,
    })
    defects.value = data?.data || []
    total.value = data?.total || 0
  } catch (err) {
    console.error('获取缺陷列表失败:', err)
    defects.value = []
  }
}

const joinArr = (arr) => {
  if (!arr || !arr.length) return '--'
  return arr.join('、')
}

onMounted(() => { fetchDefects() })
</script>

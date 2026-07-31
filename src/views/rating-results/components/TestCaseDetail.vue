<template>
  <div>
    <h3 class="text-[15px] font-semibold text-slate-700 mt-5 mb-3">测试用例明细</h3>
    <n-data-table
      :style="{ height: `500px` }"
      flex-height
      :columns="columns"
      :data="testcases"
      :single-line="false"
      size="small"
    />

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

<script setup>
import { ref, onMounted } from 'vue'
import { getReportTestcases } from '@/services/apis'
import { testcaseColumns, toDataTableColumns } from '../report-schema'

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

/** 列定义与 PDF 导出共用 */
const columns = toDataTableColumns(testcaseColumns)

/**
 * 拉取当前页的测试用例明细
 * @returns {Promise<void>}
 */
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

onMounted(() => {
  fetchTestcases()
})
</script>

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
import { defectColumns, SEVERITY_TAG_TYPES, toDataTableColumns } from '../report-schema'

defineOptions({ name: 'DefectDetail' })

const props = defineProps({ dataId: { type: String, required: true } })

const page = ref(1)
const pageSize = ref(200)
const total = ref(0)
const defects = ref([])

/** 列定义与 PDF 导出共用，严重程度列在页面上额外用彩色标签渲染 */
const columns = toDataTableColumns(
  defectColumns.map((column) =>
    column.key === 'severity'
      ? {
          ...column,
          render: (row) =>
            row.severity ? (
              <n-tag bordered={false} size="tiny" type={SEVERITY_TAG_TYPES[row.severity] || 'default'}>
                {row.severity}
              </n-tag>
            ) : (
              '--'
            ),
        }
      : column,
  ),
)

/**
 * 拉取当前页的缺陷明细
 * @returns {Promise<void>}
 */
const fetchDefects = async () => {
  if (!props.dataId) return
  try {
    const { data } = await getReportDefects({
      data_id: props.dataId,
      page: page.value,
      page_size: pageSize.value,
    })
    defects.value = data?.data || []
    total.value = data?.total || 0
  } catch (err) {
    console.error('获取缺陷列表失败:', err)
    defects.value = []
  }
}

onMounted(() => {
  fetchDefects()
})
</script>

<template>
  <n-card size="small" title="遗留风险分析">
    <n-data-table :columns="columns" :data="data" :single-line="false" size="small" />
  </n-card>
</template>

<script setup lang="jsx">
import { residualRiskColumns, RISK_LEVEL_CLASSES, toDataTableColumns } from '../report-schema'

defineOptions({ name: 'ResidualRisks' })

defineProps({ data: { type: Array, default: () => [] } })

/** 列定义与 PDF 导出共用；风险等级与应对措施在页面上额外做富渲染 */
const columns = toDataTableColumns(
  residualRiskColumns.map((column) => {
    if (column.key === 'level') {
      return {
        ...column,
        render: (row) => <span class={RISK_LEVEL_CLASSES[row.level] || ''}>{row.level || '--'}</span>,
      }
    }
    if (column.key === 'mitigation') {
      return {
        ...column,
        render: (row) => {
          const items = row.mitigation || []
          return items.length ? (
            <ol class="list-decimal pl-4">
              {items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          ) : (
            '--'
          )
        },
      }
    }
    return column
  }),
)
</script>

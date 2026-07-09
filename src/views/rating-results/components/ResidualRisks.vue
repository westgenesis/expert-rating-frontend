<template>
  <n-card size="small" title="遗留风险分析">
    <n-data-table :columns="columns" :data="data" :single-line="false" size="small" />
  </n-card>
</template>

<script setup lang="jsx">
defineOptions({ name: 'ResidualRisks' })

defineProps({ data: { type: Array, default: () => [] } })

const riskClassMap = { 高: 'text-red-600 font-semibold', 中: 'text-amber-500 font-semibold', 低: 'text-green-600 font-semibold' }

const columns = [
  { title: '风险编号', key: 'risk_id', width: 100 },
  { title: '风险描述', key: 'description', ellipsis: { tooltip: true } },
  { title: '风险等级', key: 'level', width: 90,
    render: (row) => <span class={riskClassMap[row.level] || ''}>{row.level || '--'}</span> },
  { title: '关联缺陷/用例', key: 'related_items', width: 160,
    render: (row) => (row.related_items || []).join('、') || '--' },
  { title: '影响范围', key: 'impact_scope', ellipsis: { tooltip: true } },
  { title: '应对措施与建议', key: 'mitigation',
    render: (row) => {
      const items = row.mitigation || []
      return items.length
        ? <ol class="list-decimal pl-4">{items.map((m, i) => <li key={i}>{m}</li>)}</ol>
        : '--'
    } },
]
</script>

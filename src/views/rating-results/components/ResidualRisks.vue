<template>
  <n-card size="small" title="遗留风险分析">
    <n-table :single-line="false" size="small">
      <thead>
        <tr>
          <th>风险编号</th>
          <th>风险描述</th>
          <th>风险等级</th>
          <th>关联缺陷/用例</th>
          <th>影响范围</th>
          <th>应对措施与建议</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.risk_id">
          <td>{{ item.risk_id || '--' }}</td>
          <td>{{ item.description || '--' }}</td>
          <td>
            <span :class="getRiskLevelClass(item.level)">
              {{ item.level || '--' }}
            </span>
          </td>
          <td>{{ formatArray(item.related_items) }}</td>
          <td>{{ item.impact_scope || '--' }}</td>
          <td>
            <ol v-if="item.mitigation?.length" class="list-decimal pl-4">
              <li v-for="(m, idx) in item.mitigation" :key="idx">{{ m }}</li>
            </ol>
            <span v-else>--</span>
          </td>
        </tr>
        <tr v-if="!data.length">
          <td colspan="6" class="text-center text-gray-400 py-8">暂无遗留风险</td>
        </tr>
      </tbody>
    </n-table>
  </n-card>
</template>

<script setup>
defineOptions({
  name: 'ResidualRisks',
})

defineProps({
  /** 遗留风险数组 */
  data: {
    type: Array,
    default: () => [],
  },
})

/**
 * 格式化数组为逗号分隔文本
 * @param {Array} arr - 数组
 */
const formatArray = (arr) => {
  if (!arr || !arr.length) return '--'
  return arr.join('、')
}

/**
 * 根据风险等级返回样式类名
 * @param {string} level - 风险等级（高/中/低）
 */
const getRiskLevelClass = (level) => {
  const classMap = {
    高: 'text-red-600 font-semibold',
    中: 'text-amber-500 font-semibold',
    低: 'text-green-600 font-semibold',
  }
  return classMap[level] || ''
}
</script>

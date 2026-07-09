<template>
  <div>
    <h3 class="text-[15px] font-semibold text-slate-700 mt-5 mb-3">用例执行汇总（按优先级）</h3>
    <n-data-table :columns="columns" :data="tableData" :single-line="false" size="small" />

    <!-- 数据说明 -->
    <div
      v-if="dataSummary"
      class="text-sm text-slate-500 leading-relaxed mt-3 p-3 bg-slate-50 rounded-lg"
    >
      <strong>数据说明：</strong>{{ dataSummary }}
    </div>
  </div>
</template>

<script setup lang="jsx">
import { computed } from 'vue'

defineOptions({
  name: 'ExecutionSummary',
})

const props = defineProps({
  /** 执行汇总列表，来自 report/summary 的 execution_summary */
  data: {
    type: Array,
    default: () => [],
  },
})

/** n-data-table 列定义 */
const columns = [
  { title: '序号', key: 'index', width: 60 },
  { title: '用例优先级', key: 'priority' },
  { title: '用例数量', key: 'total' },
  { title: '测试通过用例数', key: 'passed' },
  { title: '测试失败用例数', key: 'failed' },
  { title: '异常用例数', key: 'abnormal' },
  { title: '无判定用例数', key: 'undetermined' },
  { title: '未执行用例数', key: 'not_executed' },
  { title: '测试通过率', key: 'pass_rate' },
]

/** 转换原始数据为表格行，汇总行序号/优先级合并显示 */
const tableData = computed(() => {
  if (!props.data?.length) return []
  return props.data.map((item, idx) => ({
    index: item.priority === '全部' ? '' : idx + 1,
    priority: item.priority === '全部' ? '汇总' : item.priority,
    total: item.total ?? '--',
    passed: item.passed ?? '--',
    failed: item.failed ?? '--',
    abnormal: item.abnormal ?? 0,
    undetermined: item.undetermined ?? 0,
    not_executed: item.not_executed ?? 0,
    pass_rate: item.pass_rate != null ? item.pass_rate + '%' : '--',
    // 标记汇总行样式
    _isSummary: item.priority === '全部',
  }))
})

/** 汇总行的 row-class-name */
const rowClassName = (row) => {
  return row._isSummary ? 'bg-blue-50 font-semibold' : ''
}

/**
 * 自动生成数据说明文字
 */
const dataSummary = computed(() => {
  if (!props.data.length) return ''
  const allRow = props.data.find((item) => item.priority === '全部')
  if (!allRow) return ''
  const { total, passed, failed, pass_rate } = allRow
  return `本次测试共覆盖 ${total} 条用例，整体通过率 ${pass_rate}%。` +
    (failed > 0 ? `共有 ${failed} 条用例失败，是本次测试的主要关注点。` : '所有用例全部通过。')
})
</script>

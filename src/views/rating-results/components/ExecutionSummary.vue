<template>
  <div>
    <h3 class="text-[15px] font-semibold text-slate-700 mt-5 mb-3">用例执行汇总（按优先级）</h3>
    <n-table :single-line="false" size="small">
      <thead>
        <tr>
          <th>序号</th>
          <th>用例优先级</th>
          <th>用例数量</th>
          <th>测试通过用例数</th>
          <th>测试失败用例数</th>
          <th>异常用例数</th>
          <th>无判定用例数</th>
          <th>未执行用例数</th>
          <th>测试通过率</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in data" :key="index">
          <tr :class="{ 'bg-blue-50 font-semibold': item.priority === '全部' }">
            <td v-if="item.priority === '全部'" colspan="2" class="text-center">汇总</td>
            <template v-else>
              <td>{{ index + 1 }}</td>
              <td>{{ item.priority }}</td>
            </template>
            <td>{{ item.total ?? '--' }}</td>
            <td>{{ item.passed ?? '--' }}</td>
            <td>{{ item.failed ?? '--' }}</td>
            <td>{{ item.abnormal ?? 0 }}</td>
            <td>{{ item.undetermined ?? 0 }}</td>
            <td>{{ item.not_executed ?? 0 }}</td>
            <td>{{ item.pass_rate != null ? item.pass_rate + '%' : '--' }}</td>
          </tr>
        </template>
        <tr v-if="!data.length">
          <td colspan="9" class="text-center text-gray-400 py-8">暂无数据</td>
        </tr>
      </tbody>
    </n-table>

    <!-- 数据说明 -->
    <div
      v-if="dataSummary"
      class="text-sm text-slate-500 leading-relaxed mt-3 p-3 bg-slate-50 rounded-lg"
    >
      <strong>数据说明：</strong>{{ dataSummary }}
    </div>
  </div>
</template>

<script setup>
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

/**
 * 自动生成数据说明文字
 * 汇总全部优先级的数据，生成一段描述性统计说明
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

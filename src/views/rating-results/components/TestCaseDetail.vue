<template>
  <div>
    <h3 class="text-[15px] font-semibold text-slate-700 mt-5 mb-3">测试用例明细</h3>

    <n-table :single-line="false" size="small">
      <thead>
        <tr>
          <th>用例编号</th>
          <th>用例名称</th>
          <th>测试类型</th>
          <th>优先级</th>
          <th>描述信息</th>
          <th>逻辑用例</th>
          <th>测试步骤</th>
          <th>预期结果</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in testcases" :key="item.testcase_id || item.testcase_number">
          <td>{{ item.testcase_number || item.testcase_id || '--' }}</td>
          <td>{{ item.testcase_name || '--' }}</td>
          <td>{{ item.testcase_type || '--' }}</td>
          <td>{{ item.priority || '--' }}</td>
          <td>{{ item.description || '--' }}</td>
          <td>{{ formatLogicalCases(item.logical_cases) }}</td>
          <td>{{ formatSteps(item.steps) }}</td>
          <td>{{ formatExpectedResults(item.expected_results) }}</td>
        </tr>
        <tr v-if="!testcases.length">
          <td colspan="8" class="text-center text-gray-400 py-8">暂无数据</td>
        </tr>
      </tbody>
    </n-table>

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

defineOptions({
  name: 'TestCaseDetail',
})

const props = defineProps({
  /** 测试评测任务唯一ID */
  dataId: {
    type: String,
    required: true,
  },
})

/** 当前页码 */
const page = ref(1)

/** 每页数量（后端最大200） */
const pageSize = ref(200)

/** 数据总数 */
const total = ref(0)

/** 测试用例列表 */
const testcases = ref([])

/**
 * 获取测试用例分页数据
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

/**
 * 格式化逻辑用例数组为文本
 * @param {Array} cases - logical_cases 数组
 */
const formatLogicalCases = (cases) => {
  if (!cases || !cases.length) return '--'
  return cases.join('；')
}

/**
 * 格式化测试步骤
 * 按 order 排序后拼接 action
 * @param {Array} steps - steps 数组
 */
const formatSteps = (steps) => {
  if (!steps || !steps.length) return '--'
  return steps
    .sort((a, b) => {
      const orderA = parseInt(a.order, 10) || 0
      const orderB = parseInt(b.order, 10) || 0
      return orderA - orderB
    })
    .map((s) => s.action)
    .join('\n')
}

/**
 * 格式化预期结果数组
 * @param {Array} results - expected_results 数组
 */
const formatExpectedResults = (results) => {
  if (!results || !results.length) return '--'
  return results.join('\n')
}

onMounted(() => {
  fetchTestcases()
})
</script>

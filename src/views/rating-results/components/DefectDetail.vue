<template>
  <div>
    <h3 class="text-[15px] font-semibold text-slate-700 mt-5 mb-3">缺陷明细清单</h3>

    <n-table :single-line="false" size="small">
      <thead>
        <tr>
          <th>所属测试集</th>
          <th>缺陷编号</th>
          <th>关联用例编号</th>
          <th>缺陷描述</th>
          <th>严重程度</th>
          <th>发生频率</th>
          <th>缺陷场景</th>
          <th>复现步骤</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in defects" :key="item.bug_id">
          <td>{{ formatArray(item.testsuite_names) }}</td>
          <td>{{ item.bug_id || '--' }}</td>
          <td>{{ formatArray(item.associated_testcase_ids) }}</td>
          <td>{{ item.title || '--' }}</td>
          <td>
            <n-tag
              v-if="item.severity"
              :bordered="false"
              size="tiny"
              :type="getSeverityTagType(item.severity)"
            >
              {{ item.severity }}
            </n-tag>
            <span v-else>--</span>
          </td>
          <td>{{ item.frequency || '--' }}</td>
          <td>{{ item.defect_scenario || '--' }}</td>
          <td>{{ item.reproduction_steps || '--' }}</td>
        </tr>
        <tr v-if="!defects.length">
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
        @update:page="fetchDefects"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getReportDefects } from '@/services/apis'

defineOptions({
  name: 'DefectDetail',
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

/** 缺陷列表 */
const defects = ref([])

/**
 * 获取缺陷分页数据
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

/**
 * 格式化数组字段为顿号分隔文本
 * @param {Array} arr - 数组
 */
const formatArray = (arr) => {
  if (!arr || !arr.length) return '--'
  return arr.join('、')
}

/**
 * 根据严重程度返回 n-tag 的 type
 * @param {string} severity - 缺陷等级 (A/B/C/D)
 */
const getSeverityTagType = (severity) => {
  const typeMap = {
    A: 'error',
    B: 'warning',
    C: 'info',
    D: 'success',
  }
  return typeMap[severity] || 'default'
}

onMounted(() => {
  fetchDefects()
})
</script>

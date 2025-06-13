<template>
  <n-card title="历史打分记录">
    <n-data-table :columns="columns" :data="data" />
  </n-card>
</template>

<script setup lang="jsx">
import { ref, onMounted } from 'vue'
import { getTapAllScoreHistory } from '@/services/apis'
import { format } from 'date-fns'
import router from '@/router'
const data = ref([
  // 评分时间 测试对象 客观得分 主观得分 综合得分 评分专家
  {
    id: 1,
    ratingTime: '2023-10-01',
    testObject: '对象A',
    objectiveScore: 85,
    subjectiveScore: 90,
    overallScore: 87.5,
    rater: '专家1',
  },
  {
    id: 2,
    ratingTime: '2023-10-02',
    testObject: '对象B',
    objectiveScore: 78,
    subjectiveScore: 82,
    overallScore: 80,
    rater: '专家2',
  },
  {
    id: 3,
    ratingTime: '2023-10-03',
    testObject: '对象C',
    objectiveScore: 92,
    subjectiveScore: 88,
    overallScore: 90,
    rater: '专家3',
  },
])

const columns = ref([
  // 列： 序号 评分时间 测试对象 客观得分 主观得分 综合得分 评分专家 操作
  {
    title: '序号',
    width: 80,
    render(row, index) {
      return index + 1
    },
  },
  {
    title: '评分时间',
    key: '评分时间',
    width: 150,
    render(row) {
      return row['评分时间'] ? format(new Date(row['评分时间']), 'yyyy-MM-dd HH:mm:ss') : ''
    },
  },
  { title: '测试对象', key: '测试对象', width: 150 },
  { title: '客观得分', key: '客观得分', width: 120 },
  { title: '主观得分', key: '主观得分', width: 120 },
  { title: '综合得分', key: '综合得分', width: 120 },
  { title: '评分专家', key: '评分专家', width: 120 },
  {
    title: '操作',
    key: 'action',
    width: 100,
    render(row) {
      return (
        <n-button quaternary type="info" onClick={() => handleView(row)}>
          查看
        </n-button>
      )
    },
  },
])

const handleView = (row) => {
  router.push({
    name: 'rating-results',
    query: {
      name: row['测试对象'],
    },
  })
}

const getRatingHistory = async () => {
  const res = await getTapAllScoreHistory()
  data.value = res.data || []
}

onMounted(() => {
  getRatingHistory()
})
</script>

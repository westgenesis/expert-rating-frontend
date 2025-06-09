<template>
  <n-card title="历史打分记录">
    <n-data-table :columns="columns" :data="data" />
  </n-card>
</template>

<script setup lang="jsx">
import { ref, onMounted } from 'vue'

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
  { title: '评分时间', key: 'ratingTime', width: 150 },
  { title: '测试对象', key: 'testObject', width: 150 },
  { title: '客观得分', key: 'objectiveScore', width: 120 },
  { title: '主观得分', key: 'subjectiveScore', width: 120 },
  { title: '综合得分', key: 'overallScore', width: 120 },
  { title: '评分专家', key: 'rater', width: 120 },
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
  // 模拟查看打分详情
  console.log('查看打分详情:', row)
}

const getRatingHistory = async () => {
  // 模拟获取历史打分记录
  // 实际应用中可以调用API获取数据
  console.log('获取历史打分记录')
}

onMounted(() => {
  getRatingHistory()
})
</script>

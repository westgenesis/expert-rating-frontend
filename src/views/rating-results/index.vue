<template>
  <section class="w-full mx-auto">
    <!-- 页面级加载状态 -->
    <n-spin :show="pageLoading" size="large">
      <template #description>正在加载报告数据...</template>

      <div class="flex justify-between items-start mb-5">
        <ReportHeader :testObject="summary?.test_object || ''" class="!mb-0" />
        <ExportPDFButton :summary="summary" :analysisData="analysisData" :dataId="dataId" />
      </div>

      <!-- 评价概况（复用原有 RatingOverview 组件） -->
      <RatingOverview
        v-if="summary?.overview"
        :data="summary.overview"
        :isConfirmed="!!confirmData?.['主观确认状态']"
        class="mb-5"
      />

      <!-- 测试用例统计信息 -->
      <n-card size="small" title="测试用例统计信息" class="mb-5">
        <!-- 用例执行汇总 -->
        <ExecutionSummary :data="summary?.execution_summary || []" />

        <!-- 测试用例明细 -->
        <TestCaseDetail :dataId="dataId" />
      </n-card>

      <!-- 缺陷统计 + 缺陷明细 -->
      <n-card size="small" title="缺陷分布统计与明细" class="mb-5">
        <DefectStatistics :data="summary?.defect_statistics" />
        <DefectDetail :dataId="dataId" />
      </n-card>

      <!-- 主观评价详情 -->
      <RatingHistory :dataId="dataId" class="mb-5" />

      <!-- 迭代用例推荐 -->
      <UsecasesRecommend :dataId="dataId" class="mb-5" />

      <!-- AI 分析区域 -->
      <template v-if="analysisData">
        <!-- 整体质量分析 -->
        <QualityAnalysis
          v-if="analysisData.quality_analysis?.length"
          :data="analysisData.quality_analysis"
          :conclusion="analysisData.conclusion || ''"
          class="mb-5"
        />

        <!-- 遗留风险分析 -->
        <ResidualRisks
          v-if="analysisData.residual_risks?.length"
          :data="analysisData.residual_risks"
          class="mb-5"
        />

        <!-- 后续优化落地建议 -->
        <OptimizationSuggestions
          v-if="analysisData.optimization_suggestions?.length"
          :data="analysisData.optimization_suggestions"
          class="mb-5"
        />
      </template>

      <!-- AI 分析加载/失败状态 -->
      <n-card v-if="analysisStatus === 'processing'" size="small" class="mb-5">
        <div class="flex items-center justify-center py-12">
          <n-spin size="medium" />
          <span class="ml-3 text-gray-500">AI 正在生成分析报告，请稍候...</span>
        </div>
      </n-card>

      <n-card v-if="analysisStatus === 'failed'" size="small" class="mb-5">
        <div class="flex flex-col items-center py-8 gap-4">
          <span class="text-red-500">{{ analysisError || 'AI 分析生成失败' }}</span>
          <n-button type="primary" @click="handleRetryAnalysis" :loading="analysisRetrying">
            重新生成分析
          </n-button>
        </div>
      </n-card>
      <!-- 底部操作按钮（打印时隐藏） -->
      <div class="flex justify-end gap-3 pb-4 footer-actions" v-if="!confirmData?.['主观确认状态']">
        <ConfirmResult :dataId="dataId" @submit="fetchConfirmData" />
        <n-button type="primary" @click="expertDrawerVisible = true"> 邀请专家评分 </n-button>
      </div>
    </n-spin>

    <!-- 专家邀请抽屉 -->
    <ExpertDrawer v-model:visible="expertDrawerVisible" :dataId="dataId" />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  getReportSummary,
  getReportAnalysis,
  postReportAnalysisGenerate,
  getTapGetTestsetByDataId,
} from '@/services/apis'
import ReportHeader from './components/ReportHeader.vue'
import ExportPDFButton from './components/ExportPDFButton.vue'
import RatingOverview from './components/RatingOverview/index.vue'
import ExecutionSummary from './components/ExecutionSummary.vue'
import TestCaseDetail from './components/TestCaseDetail.vue'
import DefectStatistics from './components/DefectStatistics.vue'
import DefectDetail from './components/DefectDetail.vue'
import QualityAnalysis from './components/QualityAnalysis.vue'
import ResidualRisks from './components/ResidualRisks.vue'
import OptimizationSuggestions from './components/OptimizationSuggestions.vue'
import RatingHistory from './components/RatingHistory.vue'
import UsecasesRecommend from './components/UsecasesRecommend.vue'
import ConfirmResult from './components/ConfirmResult.vue'
import ExpertDrawer from './components/ExpertDrawer.vue'

defineOptions({
  name: 'RatingReport',
})

const route = useRoute()

/** 测试评测任务唯一ID，从路由query参数获取 */
const dataId = ref(route.query.data_id || '')

/** 页面整体加载状态 */
const pageLoading = ref(false)

/** 报告汇总数据 */
const summary = ref(null)

/** AI 分析结果数据 */
const analysisData = ref(null)

/** AI 分析状态：not_generated | processing | ready | failed */
const analysisStatus = ref('not_generated')

/** AI 分析错误信息 */
const analysisError = ref('')

/** 重新生成中 */
const analysisRetrying = ref(false)

/** 专家抽屉可见性 */
const expertDrawerVisible = ref(false)

const confirmData = ref(null)

// 获取确认状态数据
const fetchConfirmData = async () => {
  if (!dataId.value) return
  try {
    const { data } = await getTapGetTestsetByDataId({ data_id: dataId.value })
    confirmData.value = data?.[0] || null
  } catch (err) {
    console.error('获取确认状态失败:', err)
  }
}

/**
 * 获取报告汇总数据
 * 包含：评价概况、执行汇总、缺陷统计、分析状态
 */
const fetchSummary = async () => {
  if (!dataId.value) return
  try {
    const { data } = await getReportSummary({ data_id: dataId.value })
    summary.value = data
    // 检查大模型分析状态
    if (data?.analysis) {
      handleAnalysisStatus(data.analysis)
    }
  } catch (err) {
    console.error('获取报告汇总失败:', err)
  }
}

/**
 * 根据分析状态决定后续操作
 * - not_generated → 自动触发生成
 * - processing → 显示等待状态
 * - ready → 从汇总接口已获取数据（若字段存在）
 * - failed → 显示错误，允许重试
 */
const handleAnalysisStatus = async (analysis) => {
  analysisStatus.value = analysis.status

  if (analysis.status === 'ready' && summary.value?.analysis) {
    // 如果汇总接口已包含完整分析数据
    const fullAnalysis = summary.value.analysis
    if (fullAnalysis.quality_analysis) {
      analysisData.value = fullAnalysis
      return
    }
  }

  if (analysis.status === 'not_generated') {
    // 自动触发大模型生成
    await triggerAnalysisGenerate()
  } else if (analysis.status === 'ready') {
    // 查询完整分析结果
    await fetchAnalysis()
  } else if (analysis.status === 'failed') {
    analysisError.value = analysis.error || 'AI 分析生成失败'
  }
  // processing 状态直接显示等待
}

/**
 * 触发大模型生成分析（同步接口，等待完成）
 */
const triggerAnalysisGenerate = async () => {
  analysisStatus.value = 'processing'
  try {
    const { data } = await postReportAnalysisGenerate({
      data_id: dataId.value,
      force: false,
    })
    if (data?.status === 'ready') {
      analysisData.value = data
      analysisStatus.value = 'ready'
    } else if (data?.status === 'failed') {
      analysisStatus.value = 'failed'
      analysisError.value = data?.error || 'AI 分析生成失败'
    }
  } catch (err) {
    console.error('AI 分析生成失败:', err)
    analysisStatus.value = 'failed'
    // 处理 409 冲突
    if (err?.response?.status === 409) {
      analysisError.value = '该报告正在生成分析，请稍后刷新页面'
    } else {
      analysisError.value = err?.response?.data?.detail || 'AI 分析生成失败，请重试'
    }
  }
}

/**
 * 查询大模型分析结果
 */
const fetchAnalysis = async () => {
  try {
    const { data } = await getReportAnalysis({ data_id: dataId.value })
    if (data?.status === 'ready') {
      analysisData.value = data
      analysisStatus.value = 'ready'
    } else {
      analysisStatus.value = data?.status || 'not_generated'
    }
  } catch (err) {
    console.error('查询分析结果失败:', err)
  }
}

/**
 * 重新生成 AI 分析
 */
const handleRetryAnalysis = async () => {
  analysisRetrying.value = true
  await triggerAnalysisGenerate()
  analysisRetrying.value = false
}
onMounted(async () => {
  if (!dataId.value) return
  pageLoading.value = true
  await fetchSummary()
  await fetchConfirmData()
  pageLoading.value = false
})
</script>

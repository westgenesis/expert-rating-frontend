<template>
  <section class="w-full mx-auto">
    <!-- 页面级加载状态 -->
    <n-spin :show="pageLoading" size="large">
      <template #description>正在加载报告数据...</template>

      <!-- 报告头部 -->
        <ReportHeader :testObject="summary?.test_object || ''" @export="handleExportPDF" />

        <!-- 评价概况（复用原有 RatingOverview 组件） -->
        <RatingOverview v-if="summary?.overview" :data="summary.overview" class="mb-5" />

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
      <div class="flex justify-end gap-3 pb-4 footer-actions">
        <ConfirmResult :dataId="dataId" />
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
import { getReportSummary, getReportAnalysis, postReportAnalysisGenerate } from '@/services/apis'
import ReportHeader from './components/ReportHeader.vue'
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

/**
 * 导出PDF报告
 * 生成独立HTML文档，在新窗口中打开并自动调起打印
 * 用户可在打印对话框中选择"另存为PDF"
 */
const handleExportPDF = () => {
  const overview = summary.value?.overview || {}
  const executionSummary = summary.value?.execution_summary || []
  const defectStats = summary.value?.defect_statistics || {}
  const testObject = summary.value?.test_object || '--'

  // 构建用例执行汇总表格行
  const buildExecutionRows = () => {
    return executionSummary
      .map(
        (item, idx) => `
        <tr class="${item.priority === '全部' ? 'summary-row' : ''}">
          ${
            item.priority === '全部'
              ? '<td colspan="2" style="text-align:center">汇总</td>'
              : `<td>${idx + 1}</td><td>${item.priority}</td>`
          }
          <td>${item.total ?? '--'}</td>
          <td>${item.passed ?? '--'}</td>
          <td>${item.failed ?? '--'}</td>
          <td>${item.abnormal ?? 0}</td>
          <td>${item.undetermined ?? 0}</td>
          <td>${item.not_executed ?? 0}</td>
          <td>${item.pass_rate != null ? item.pass_rate + '%' : '--'}</td>
        </tr>`,
      )
      .join('')
  }

  // 构建缺陷等级分布行
  const buildSeverityRows = () => {
    const dist = defectStats.severity_distribution || {}
    const labels = { A: 'A级（致命）', B: 'B级（严重）', C: 'C级（一般）', D: 'D级（轻微）' }
    return Object.entries(dist)
      .map(
        ([key, count], idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${key}（${labels[key] || ''}）</td>
          <td>${count}</td>
        </tr>`,
      )
      .join('')
  }

  // 构建质量分析卡片
  const buildQualityCards = () => {
    if (!analysisData.value?.quality_analysis?.length) return ''
    return analysisData.value.quality_analysis
      .map(
        (item) => `
        <div class="quality-card">
          <h4>${item.dimension} <span class="level-tag level-${item.level}">${item.level}</span></h4>
          <p>${item.summary || ''}</p>
        </div>`,
      )
      .join('')
  }

  // 构建遗留风险行
  const buildRiskRows = () => {
    if (!analysisData.value?.residual_risks?.length) return ''
    return analysisData.value.residual_risks
      .map(
        (item) => `
        <tr>
          <td>${item.risk_id || '--'}</td>
          <td>${item.description || '--'}</td>
          <td class="risk-${item.level}">${item.level || '--'}</td>
          <td>${(item.related_items || []).join('、') || '--'}</td>
          <td>${item.impact_scope || '--'}</td>
          <td>${(item.mitigation || []).map((m, i) => `${i + 1}. ${m}`).join('<br>') || '--'}</td>
        </tr>`,
      )
      .join('')
  }

  // 构建优化建议
  const buildSuggestions = () => {
    if (!analysisData.value?.optimization_suggestions?.length) return ''
    return analysisData.value.optimization_suggestions
      .map(
        (item, idx) => `
        <div class="suggestion-item">
          <h4>${idx + 1}. ${item.title}</h4>
          <p>${item.content}</p>
        </div>`,
      )
      .join('')
  }

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>评测结果</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #303133; line-height: 1.6; padding: 24px 32px; background: #fff; }
  h1 { font-size: 22px; color: #1e293b; margin-bottom: 4px; }
  .subtitle { font-size: 14px; color: #64748b; margin-bottom: 24px; }
  .section { margin-bottom: 20px; }
  .section-title { font-size: 17px; font-weight: 600; color: #1e293b; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 14px; }
  .overview { display: flex; gap: 32px; align-items: stretch; }
  .score-panel { text-align: center; padding: 24px 20px; background: #f8fafc; border-radius: 8px; min-width: 200px; }
  .score-val { font-size: 48px; font-weight: 700; color: ${overview.passed ? '#16a34a' : '#ef4444'}; }
  .score-label { font-size: 13px; color: #64748b; margin: 4px 0 12px; }
  .status-badge { display: inline-block; padding: 4px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; background: ${overview.passed ? '#f0fdf4' : '#fef2f2'}; color: ${overview.passed ? '#16a34a' : '#dc2626'}; border: 1px solid ${overview.passed ? '#bbf7d0' : '#fecaca'}; }
  .detail { flex:1; display:flex; flex-direction:column; gap:14px; }
  .metrics { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; }
  .metric { background:#f8fafc; border-radius:6px; padding:14px 10px; text-align:center; }
  .metric-num { font-size:22px; font-weight:600; color:#1e293b; }
  .metric-name { font-size:12px; color:#64748b; }
  .judge { background:#fffbeb; border-left:3px solid #f59e0b; padding:12px 16px; border-radius:0 4px 4px 0; font-size:13px; color:#92400e; }
  .judge h4 { margin-bottom:4px; }
  .judge ul { padding-left:18px; }
  table { width:100%; border-collapse:collapse; margin-bottom:14px; font-size:13px; }
  th { background:#f1f5f9; color:#475569; font-weight:600; text-align:left; padding:9px 10px; border-bottom:2px solid #e2e8f0; }
  td { padding:9px 10px; border-bottom:1px solid #f1f5f9; color:#334155; vertical-align:top; }
  .summary-row { background:#f0f9ff; font-weight:600; }
  .severity-A { color:#dc2626; font-weight:600; } .severity-B { color:#ea580c; font-weight:600; } .severity-C { color:#ca8a04; font-weight:600; } .severity-D { color:#16a34a; font-weight:600; }
  .risk-高 { color:#dc2626; font-weight:600; } .risk-中 { color:#f59e0b; font-weight:600; } .risk-低 { color:#16a34a; font-weight:600; }
  .quality-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(280px,1fr)); gap:14px; margin-bottom:16px; }
  .quality-card { border:1px solid #e5e7eb; border-radius:6px; padding:14px 16px; }
  .quality-card h4 { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; font-size:14px; }
  .level-tag { padding:2px 8px; border-radius:10px; font-size:11px; font-weight:500; }
  .level-优 { background:#dcfce7; color:#166534; } .level-良 { background:#dbeafe; color:#1e40af; } .level-中 { background:#fef3c7; color:#92400e; } .level-差 { background:#fef2f2; color:#991b1b; }
  .quality-card p { font-size:12px; color:#64748b; line-height:1.6; }
  .conclusion { padding:14px 18px; background:#eff6ff; border-left:3px solid #3b82f6; border-radius:0 4px 4px 0; }
  .conclusion h4 { color:#1e40af; margin-bottom:6px; }
  .conclusion p { font-size:13px; color:#1e3a8a; line-height:1.7; }
  .suggestion-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(400px,1fr)); gap:12px; }
  .suggestion-item { padding:14px 16px; background:#f8fafc; border-radius:6px; border:1px solid #e5e7eb; }
  .suggestion-item h4 { color:#1e293b; margin-bottom:6px; font-size:14px; }
  .suggestion-item p { font-size:13px; color:#475569; line-height:1.7; }
  @media print { body { padding:16px; } .section { page-break-inside:avoid; } }
</style>
</head>
<body>
  <h1>评测结果</h1>
  <div class="subtitle">测试对象：${testObject}</div>

  <!-- 评价概况 -->
  <div class="section">
    <div class="section-title">评价概况</div>
    <div class="overview">
      <div class="score-panel">
        <div class="score-val">${overview.comprehensive_score != null ? overview.comprehensive_score.toFixed(2) : '--'}</div>
        <div class="score-label">综合评分</div>
        <span class="status-badge">${overview.status_text || (overview.passed ? '测试通过' : '测试未通过')}</span>
      </div>
      <div class="detail">
        <div class="metrics">
          <div class="metric"><div class="metric-num">${overview.objective_score != null ? overview.objective_score.toFixed(2) : '--'}</div><div class="metric-name">客观评分</div></div>
          <div class="metric"><div class="metric-num">${overview.expert_average_score != null ? overview.expert_average_score.toFixed(2) : '--'}</div><div class="metric-name">专家平均分</div></div>
          <div class="metric"><div class="metric-num">${overview.testcase_total ?? '--'}</div><div class="metric-name">测试用例总数</div></div>
          <div class="metric"><div class="metric-num">${overview.overall_pass_rate != null ? overview.overall_pass_rate + '%' : '--'}</div><div class="metric-name">整体通过率</div></div>
          <div class="metric"><div class="metric-num">${overview.defect_total ?? '--'}</div><div class="metric-name">缺陷总数</div></div>
        </div>
        ${
          (overview.judgement_reasons || []).length
            ? `<div class="judge"><h4>判定依据</h4><ul>${overview.judgement_reasons.map((r) => `<li>${r}</li>`).join('')}</ul></div>`
            : ''
        }
      </div>
    </div>
  </div>

  <!-- 用例执行汇总 -->
  <div class="section">
    <div class="section-title">用例执行汇总（按优先级）</div>
    <table>
      <thead><tr><th>序号</th><th>用例优先级</th><th>用例数量</th><th>通过</th><th>失败</th><th>异常</th><th>无判定</th><th>未执行</th><th>通过率</th></tr></thead>
      <tbody>${buildExecutionRows()}</tbody>
    </table>
  </div>

  <!-- 缺陷等级分布 -->
  <div class="section">
    <div class="section-title">缺陷等级分布</div>
    <table>
      <thead><tr><th>序号</th><th>缺陷等级</th><th>数量</th></tr></thead>
      <tbody>
        ${buildSeverityRows()}
        <tr class="summary-row"><td colspan="2">缺陷总数</td><td>${defectStats.total ?? 0}</td></tr>
      </tbody>
    </table>
  </div>

  ${
    analysisData.value
      ? `
  <!-- 整体质量分析 -->
  ${
    analysisData.value.quality_analysis?.length
      ? `<div class="section"><div class="section-title">整体质量分析</div><div class="quality-grid">${buildQualityCards()}</div>${
          analysisData.value.conclusion
            ? `<div class="conclusion"><h4>综合结论</h4><p>${analysisData.value.conclusion}</p></div>`
            : ''
        }</div>`
      : ''
  }

  <!-- 遗留风险分析 -->
  ${
    analysisData.value.residual_risks?.length
      ? `<div class="section"><div class="section-title">遗留风险分析</div><table><thead><tr><th>风险编号</th><th>风险描述</th><th>风险等级</th><th>关联缺陷/用例</th><th>影响范围</th><th>应对措施</th></tr></thead><tbody>${buildRiskRows()}</tbody></table></div>`
      : ''
  }

  <!-- 后续优化落地建议 -->
  ${
    analysisData.value.optimization_suggestions?.length
      ? `<div class="section"><div class="section-title">后续优化落地建议</div><div class="suggestion-grid">${buildSuggestions()}</div></div>`
      : ''
  }
  `
      : ''
  }
</body>
</html>`

  const printWindow = window.open('', '_blank', 'width=900,height=700')
  if (!printWindow) return
  printWindow.document.write(html)
  printWindow.document.close()
  // 等待资源加载完成后自动调起打印
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print()
    }, 300)
  }
}

onMounted(async () => {
  if (!dataId.value) return
  pageLoading.value = true
  await fetchSummary()
  pageLoading.value = false
})
</script>

<template>
  <n-button @click="handleExport">导出PDF报告</n-button>
</template>

<script setup>
import {
  getReportTestcases,
  getReportDefects,
  getTapScoreHistory,
  getTestcaseRecommend,
} from '@/services/apis'

defineOptions({
  name: 'ExportPDFButton',
})

const props = defineProps({
  /** 报告汇总数据 */
  summary: {
    type: Object,
    default: () => ({}),
  },
  /** AI 分析结果 */
  analysisData: {
    type: Object,
    default: null,
  },
  /** 测试评测任务唯一ID */
  dataId: {
    type: String,
    required: true,
  },
})

/**
 * HTML 转义，防止 XSS
 * @param {*} val
 * @returns {string}
 */
const esc = (val) => String(val ?? '--').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * 格式化数组为顿号分隔
 * @param {Array} arr
 * @returns {string}
 */
const joinArr = (arr) => {
  if (!arr || !arr.length) return '--'
  return arr.join('、')
}

/**
 * 格式化测试步骤
 * @param {Array} steps
 * @returns {string}
 */
const fmtSteps = (steps) => {
  if (!steps || !steps.length) return '--'
  return steps
    .sort((a, b) => (parseInt(a.order, 10) || 0) - (parseInt(b.order, 10) || 0))
    .map((s) => s.action)
    .join('；')
}

/**
 * 导出PDF报告
 * 获取全部数据 → 生成独立HTML → 新窗口打印
 */
const handleExport = async () => {
  const overview = props.summary?.overview || {}
  const exec = props.summary?.execution_summary || []
  const defStats = props.summary?.defect_statistics || {}
  const testObj = props.summary?.test_object || '--'
  const did = props.dataId
  const ai = props.analysisData || {}

  // 并行获取导出所需数据
  const [tcRes, bugRes, scoreRes, recRes] = await Promise.allSettled([
    did ? getReportTestcases({ data_id: did, page: 1, page_size: 200 }) : Promise.resolve({ data: { data: [] } }),
    did ? getReportDefects({ data_id: did, page: 1, page_size: 200 }) : Promise.resolve({ data: { data: [] } }),
    did ? getTapScoreHistory({ data_id: did }) : Promise.resolve({ data: [] }),
    did ? getTestcaseRecommend({ data_id: did }) : Promise.resolve({ data: {} }),
  ])

  const tcs = tcRes.status === 'fulfilled' ? (tcRes.value?.data?.data || []) : []
  const bugs = bugRes.status === 'fulfilled' ? (bugRes.value?.data?.data || []) : []
  const scores = scoreRes.status === 'fulfilled' ? (scoreRes.value?.data || []) : []
  const rec = recRes.status === 'fulfilled' ? (recRes.value?.data || {}) : {}

  // --- 各模块 HTML 构建函数 ---

  const execRows = exec
    .map(
      (r, i) => `
        <tr class="${r.priority === '全部' ? 'summary-row' : ''}">
          ${r.priority === '全部' ? '<td colspan="2" style="text-align:center">汇总</td>' : `<td>${i + 1}</td><td>${esc(r.priority)}</td>`}
          <td>${r.total ?? '--'}</td><td>${r.passed ?? '--'}</td><td>${r.failed ?? '--'}</td>
          <td>${r.abnormal ?? 0}</td><td>${r.undetermined ?? 0}</td><td>${r.not_executed ?? 0}</td>
          <td>${r.pass_rate != null ? r.pass_rate + '%' : '--'}</td>
        </tr>`,
    )
    .join('')

  const sevLabels = { A: 'A级（致命）', B: 'B级（严重）', C: 'C级（一般）', D: 'D级（轻微）' }
  const sevRows = Object.entries(defStats.severity_distribution || {})
    .map(([k, c], i) => `<tr><td>${i + 1}</td><td>${k}（${sevLabels[k] || ''}）</td><td>${c}</td></tr>`)
    .join('')

  const freqRows = Object.entries(defStats.frequency_distribution || {})
    .map(([k, c], i) => `<tr><td>${i + 1}</td><td>${esc(k)}</td><td>${c}</td></tr>`)
    .join('')

  const tcRows = tcs
    .map(
      (r) => `
        <tr>
          <td>${esc(r.testcase_number || r.testcase_id)}</td><td>${esc(r.testcase_name)}</td>
          <td>${esc(r.testcase_type)}</td><td>${esc(r.priority)}</td><td>${esc(r.description)}</td>
          <td>${esc((r.logical_cases || []).join('；'))}</td><td>${esc(fmtSteps(r.steps))}</td>
          <td>${esc((r.expected_results || []).join('；'))}</td>
        </tr>`,
    )
    .join('')

  const bugRows = bugs
    .map(
      (r) => `
        <tr>
          <td>${esc(joinArr(r.testsuite_names))}</td><td>${esc(r.bug_id)}</td>
          <td>${esc(joinArr(r.associated_testcase_ids))}</td><td>${esc(r.title)}</td>
          <td class="severity-${r.severity || ''}">${esc(r.severity)}</td>
          <td>${esc(r.frequency)}</td><td>${esc(r.defect_scenario)}</td>
          <td>${esc(r.reproduction_steps)}</td>
        </tr>`,
    )
    .join('')

  const scoreRows = scores
    .map(
      (r) => `
        <tr>
          <td>${esc(r['评分专家'])}</td>
          <td>${r['评分'] != null ? r['评分'] : '<span style="color:#dc2626">未提交</span>'}</td>
          <td>${esc(r['更新时间'])}</td><td>${esc(r['备注'] || '-')}</td>
        </tr>`,
    )
    .join('')

  const recData = rec.defect_related || []
  const recRows = recData
    .map(
      (r) => `
        <tr>
          <td>${esc(r['用例编号'])}</td><td>${esc(r['用例名称'])}</td><td>${esc(r['前置条件'])}</td>
          <td>${esc(r['测试优先级'])}</td><td>${esc(r['测试描述'])}</td>
        </tr>`,
    )
    .join('')

  const qCards = (ai.quality_analysis || [])
    .map(
      (r) => `
        <div class="qc">
          <h4>${esc(r.dimension)} <span class="lv lv-${esc(r.level)}">${esc(r.level)}</span></h4>
          <p>${esc(r.summary)}</p>
        </div>`,
    )
    .join('')

  const riskRows = (ai.residual_risks || [])
    .map(
      (r) => `
        <tr>
          <td>${esc(r.risk_id)}</td><td>${esc(r.description)}</td><td class="rk-${esc(r.level)}">${esc(r.level)}</td>
          <td>${esc(joinArr(r.related_items))}</td><td>${esc(r.impact_scope)}</td>
          <td>${(r.mitigation || []).map((m, i) => `${i + 1}. ${esc(m)}`).join('<br>') || '--'}</td>
        </tr>`,
    )
    .join('')

  const sugCards = (ai.optimization_suggestions || [])
    .map(
      (r, i) => `
        <div class="si">
          <h4>${i + 1}. ${esc(r.title)}</h4>
          <p>${esc(r.content)}</p>
        </div>`,
    )
    .join('')

  // --- 组装 HTML ---
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"><title>评测结果</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;color:#303133;line-height:1.6;padding:24px 32px;background:#fff}
  h1{font-size:22px;color:#1e293b;margin-bottom:4px}
  .st{font-size:14px;color:#64748b;margin-bottom:24px}
  .s{margin-bottom:20px}
  .stl{font-size:17px;font-weight:600;color:#1e293b;border-bottom:2px solid #e5e7eb;padding-bottom:8px;margin-bottom:14px}
  .ov{display:flex;gap:32px}
  .sp{text-align:center;padding:24px 20px;background:#f8fafc;border-radius:8px;min-width:200px}
  .sv{font-size:48px;font-weight:700;color:${overview.passed ? '#16a34a' : '#ef4444'}}
  .sl{font-size:13px;color:#64748b;margin:4px 0 12px}
  .badge{display:inline-block;padding:4px 16px;border-radius:20px;font-size:13px;font-weight:500;background:${overview.passed ? '#f0fdf4' : '#fef2f2'};color:${overview.passed ? '#16a34a' : '#dc2626'};border:1px solid ${overview.passed ? '#bbf7d0' : '#fecaca'}}
  .dt{flex:1;display:flex;flex-direction:column;gap:14px}
  .mt{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
  .mi{background:#f8fafc;border-radius:6px;padding:14px 10px;text-align:center}
  .mn{font-size:22px;font-weight:600;color:#1e293b}
  .ml{font-size:12px;color:#64748b}
  .jd{background:#fffbeb;border-left:3px solid #f59e0b;padding:12px 16px;border-radius:0 4px 4px 0;font-size:13px;color:#92400e}
  .jd h4{margin-bottom:4px}.jd ul{padding-left:18px}
  table{width:100%;border-collapse:collapse;margin-bottom:14px;font-size:13px}
  th{background:#f1f5f9;color:#475569;font-weight:600;text-align:left;padding:9px 10px;border-bottom:2px solid #e2e8f0}
  td{padding:9px 10px;border-bottom:1px solid #f1f5f9;color:#334155;vertical-align:top}
  .smr{background:#f0f9ff;font-weight:600}
  .severity-A{color:#dc2626;font-weight:600}.severity-B{color:#ea580c;font-weight:600}.severity-C{color:#ca8a04;font-weight:600}.severity-D{color:#16a34a;font-weight:600}
  .rk-高{color:#dc2626;font-weight:600}.rk-中{color:#f59e0b;font-weight:600}.rk-低{color:#16a34a;font-weight:600}
  .qg{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin-bottom:16px}
  .qc{border:1px solid #e5e7eb;border-radius:6px;padding:14px 16px}
  .qc h4{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:14px}
  .lv{padding:2px 8px;border-radius:10px;font-size:11px;font-weight:500}
  .lv-优{background:#dcfce7;color:#166534}.lv-良{background:#dbeafe;color:#1e40af}.lv-中{background:#fef3c7;color:#92400e}.lv-差{background:#fef2f2;color:#991b1b}
  .qc p{font-size:12px;color:#64748b;line-height:1.6}
  .cc{padding:14px 18px;background:#eff6ff;border-left:3px solid #3b82f6;border-radius:0 4px 4px 0}
  .cc h4{color:#1e40af;margin-bottom:6px}.cc p{font-size:13px;color:#1e3a8a;line-height:1.7}
  .sg{display:grid;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));gap:12px}
  .si{padding:14px 16px;background:#f8fafc;border-radius:6px;border:1px solid #e5e7eb}
  .si h4{color:#1e293b;margin-bottom:6px;font-size:14px}
  .si p{font-size:13px;color:#475569;line-height:1.7}
  @media print{body{padding:16px}.s{page-break-inside:avoid}}
</style>
</head>
<body>
<h1>评测结果</h1>
<div class="st">测试对象：${esc(testObj)}</div>

<div class="s"><div class="stl">评价概况</div>
<div class="ov">
<div class="sp"><div class="sv">${overview.comprehensive_score != null ? overview.comprehensive_score.toFixed(2) : '--'}</div><div class="sl">综合评分</div><span class="badge">${esc(overview.status_text || (overview.passed ? '测试通过' : '测试未通过'))}</span></div>
<div class="dt">
<div class="mt">
<div class="mi"><div class="mn">${overview.objective_score != null ? overview.objective_score.toFixed(2) : '--'}</div><div class="ml">客观评分</div></div>
<div class="mi"><div class="mn">${overview.expert_average_score != null ? overview.expert_average_score.toFixed(2) : '--'}</div><div class="ml">专家平均分</div></div>
<div class="mi"><div class="mn">${overview.testcase_total ?? '--'}</div><div class="ml">测试用例总数</div></div>
<div class="mi"><div class="mn">${overview.overall_pass_rate != null ? overview.overall_pass_rate + '%' : '--'}</div><div class="ml">整体通过率</div></div>
<div class="mi"><div class="mn">${overview.defect_total ?? '--'}</div><div class="ml">缺陷总数</div></div>
</div>
${(overview.judgement_reasons || []).length ? `<div class="jd"><h4>判定依据</h4><ul>${overview.judgement_reasons.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div>` : ''}
</div></div></div>

<div class="s"><div class="stl">用例执行汇总（按优先级）</div>
<table><thead><tr><th>序号</th><th>用例优先级</th><th>用例数量</th><th>通过</th><th>失败</th><th>异常</th><th>无判定</th><th>未执行</th><th>通过率</th></tr></thead><tbody>${execRows}</tbody></table></div>

<div class="s"><div class="stl">测试用例明细</div>
<table><thead><tr><th>用例编号</th><th>用例名称</th><th>测试类型</th><th>优先级</th><th>描述信息</th><th>逻辑用例</th><th>测试步骤</th><th>预期结果</th></tr></thead>
<tbody>${tcRows || '<tr><td colspan="8" style="text-align:center;color:#94a3b8">暂无数据</td></tr>'}</tbody></table></div>

<div class="s"><div class="stl">缺陷分布统计</div>
<table><thead><tr><th>序号</th><th>缺陷等级</th><th>数量</th></tr></thead>
<tbody>${sevRows}<tr class="smr"><td colspan="2">缺陷总数</td><td>${defStats.total ?? 0}</td></tr></tbody></table>
${freqRows ? `<table style="margin-top:10px"><thead><tr><th>序号</th><th>发生频率</th><th>数量</th></tr></thead><tbody>${freqRows}</tbody></table>` : ''}</div>

<div class="s"><div class="stl">缺陷明细清单</div>
<table><thead><tr><th>所属测试集</th><th>缺陷编号</th><th>关联用例编号</th><th>缺陷描述</th><th>严重程度</th><th>发生频率</th><th>缺陷场景</th><th>复现步骤</th></tr></thead>
<tbody>${bugRows || '<tr><td colspan="8" style="text-align:center;color:#94a3b8">暂无数据</td></tr>'}</tbody></table></div>

${scoreRows ? `<div class="s"><div class="stl">主观评价详情</div><table><thead><tr><th>评分专家</th><th>评分</th><th>更新时间</th><th>备注</th></tr></thead><tbody>${scoreRows}</tbody></table></div>` : ''}

${recRows ? `<div class="s"><div class="stl">迭代用例推荐</div><table><thead><tr><th>用例编号</th><th>用例名称</th><th>前置条件</th><th>测试优先级</th><th>测试描述</th></tr></thead><tbody>${recRows}</tbody></table>${rec.llm_summarize ? `<div class="cc" style="margin-top:12px"><p>${esc(rec.llm_summarize)}</p></div>` : ''}</div>` : ''}

${qCards ? `<div class="s"><div class="stl">整体质量分析</div><div class="qg">${qCards}</div>${ai.conclusion ? `<div class="cc"><h4>综合结论</h4><p>${esc(ai.conclusion)}</p></div>` : ''}</div>` : ''}

${riskRows ? `<div class="s"><div class="stl">遗留风险分析</div><table><thead><tr><th>风险编号</th><th>风险描述</th><th>风险等级</th><th>关联缺陷/用例</th><th>影响范围</th><th>应对措施</th></tr></thead><tbody>${riskRows}</tbody></table></div>` : ''}

${sugCards ? `<div class="s"><div class="stl">后续优化落地建议</div><div class="sg">${sugCards}</div></div>` : ''}
</body></html>`

  const w = window.open('', '_blank', 'width=900,height=700')
  if (!w) return
  w.document.write(html)
  w.document.close()
  w.onload = () => setTimeout(() => w.print(), 300)
}
</script>

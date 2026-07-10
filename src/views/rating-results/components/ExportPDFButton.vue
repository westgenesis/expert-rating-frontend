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
import template from './export-template.html?raw'

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
const esc = (val) =>
  String(val ?? '--')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

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
 * 获取全部数据 → 填充HTML模板 → 新窗口打印
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
    did
      ? getReportTestcases({ data_id: did, page: 1, page_size: 200 })
      : Promise.resolve({ data: { data: [] } }),
    did
      ? getReportDefects({ data_id: did, page: 1, page_size: 200 })
      : Promise.resolve({ data: { data: [] } }),
    did ? getTapScoreHistory({ data_id: did }) : Promise.resolve({ data: [] }),
    did ? getTestcaseRecommend({ data_id: did }) : Promise.resolve({ data: {} }),
  ])

  const tcs = tcRes.status === 'fulfilled' ? tcRes.value?.data?.data || [] : []
  const bugs = bugRes.status === 'fulfilled' ? bugRes.value?.data?.data || [] : []
  const scores = scoreRes.status === 'fulfilled' ? scoreRes.value?.data || [] : []
  const rec = recRes.status === 'fulfilled' ? recRes.value?.data || {} : {}

  // --- CSS 动态变量 ---
  const passed = overview.passed
  const cssVars = passed
    ? '--score-color:#16a34a;--badge-bg:#f0fdf4;--badge-color:#16a34a;--badge-border:#bbf7d0'
    : '--score-color:#ef4444;--badge-bg:#fef2f2;--badge-color:#dc2626;--badge-border:#fecaca'

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
    .map(
      ([k, c], i) =>
        `<tr><td>${i + 1}</td><td>${k}（${sevLabels[k] || ''}）</td><td>${c}</td></tr>`,
    )
    .join('')

  const freqRows = Object.entries(defStats.frequency_distribution || {})
    .map(([k, c], i) => `<tr><td>${i + 1}</td><td>${esc(k)}</td><td>${c}</td></tr>`)
    .join('')

  const freqTable = freqRows
    ? `<table style="margin-top:10px"><thead><tr><th>序号</th><th>发生频率</th><th>数量</th></tr></thead><tbody>${freqRows}</tbody></table>`
    : ''

  const tcRows = tcs
    .map(
      (r) => `
        <tr>
          <td>${esc(r.testcase_number || r.testcase_id)}</td><td>${esc(r.testcase_name)}</td>
          <td>${esc(r.testcase_type)}</td><td>${esc(r.priority)}</td><td>${esc(r.description)}</td>
          <td>${esc((r.logical_cases || []).map((item) => item.ctcNum).join('；'))}</td><td>${esc(fmtSteps(r.steps))}</td>
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

  // --- 构建条件区块 ---

  const judgementBlock = (overview.judgement_reasons || []).length
    ? `<div class="jd"><h4>判定依据</h4><ul>${overview.judgement_reasons.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div>`
    : ''

  const scoreSection = scoreRows
    ? `<div class="s"><div class="stl">主观评价详情</div><table><thead><tr><th>评分专家</th><th>评分</th><th>更新时间</th><th>备注</th></tr></thead><tbody>${scoreRows}</tbody></table></div>`
    : ''

  const recSection = recRows
    ? `<div class="s"><div class="stl">迭代用例推荐</div><table><thead><tr><th>用例编号</th><th>用例名称</th><th>前置条件</th><th>测试优先级</th><th>测试描述</th></tr></thead><tbody>${recRows}</tbody></table>${rec.llm_summarize ? `<div class="cc" style="margin-top:12px"><p>${esc(rec.llm_summarize)}</p></div>` : ''}</div>`
    : ''

  const qualitySection = qCards
    ? `<div class="s"><div class="stl">整体质量分析</div><div class="qg">${qCards}</div>${ai.conclusion ? `<div class="cc"><h4>综合结论</h4><p>${esc(ai.conclusion)}</p></div>` : ''}</div>`
    : ''

  const riskSection = riskRows
    ? `<div class="s"><div class="stl">遗留风险分析</div><table><thead><tr><th>风险编号</th><th>风险描述</th><th>风险等级</th><th>关联缺陷/用例</th><th>影响范围</th><th>应对措施</th></tr></thead><tbody>${riskRows}</tbody></table></div>`
    : ''

  const suggestionSection = sugCards
    ? `<div class="s"><div class="stl">后续优化落地建议</div><div class="sg">${sugCards}</div></div>`
    : ''

  // --- 组装 HTML：模板 + 占位符替换 ---
  const html = template
    .replace('{{CSS_VARS}}', cssVars)
    .replace('{{TEST_OBJECT}}', esc(testObj))
    .replace('{{COMPREHENSIVE_SCORE}}', overview.comprehensive_score != null ? overview.comprehensive_score.toFixed(2) : '--')
    .replace('{{STATUS_TEXT}}', esc(overview.status_text || (passed ? '测试通过' : '测试未通过')))
    .replace('{{OBJECTIVE_SCORE}}', overview.objective_score != null ? overview.objective_score.toFixed(2) : '--')
    .replace('{{EXPERT_AVG_SCORE}}', overview.expert_average_score != null ? overview.expert_average_score.toFixed(2) : '--')
    .replace('{{TESTCASE_TOTAL}}', overview.testcase_total ?? '--')
    .replace('{{PASS_RATE}}', overview.overall_pass_rate != null ? overview.overall_pass_rate + '%' : '--')
    .replace('{{DEFECT_TOTAL}}', overview.defect_total ?? '--')
    .replace('{{JUDGEMENT_BLOCK}}', judgementBlock)
    .replace('{{EXEC_ROWS}}', execRows)
    .replace('{{TC_ROWS}}', tcRows || '<tr><td colspan="8" style="text-align:center;color:#94a3b8">暂无数据</td></tr>')
    .replace('{{SEV_ROWS}}', sevRows)
    .replace('{{FREQ_TABLE}}', freqTable)
    .replace('{{DEFECT_TOTAL_COUNT}}', defStats.total ?? 0)
    .replace('{{BUG_ROWS}}', bugRows || '<tr><td colspan="8" style="text-align:center;color:#94a3b8">暂无数据</td></tr>')
    .replace('{{SCORE_SECTION}}', scoreSection)
    .replace('{{REC_SECTION}}', recSection)
    .replace('{{QUALITY_SECTION}}', qualitySection)
    .replace('{{RISK_SECTION}}', riskSection)
    .replace('{{SUGGESTION_SECTION}}', suggestionSection)

  const w = window.open('', '_blank', 'width=900,height=700')
  if (!w) return
  w.document.write(html)
  w.document.close()
  w.onload = () => setTimeout(() => w.print(), 300)
}
</script>

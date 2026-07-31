/**
 * 页面尺寸与页边距。
 *
 * 表格列宽要按可用宽度精确分配，所以这些数值必须集中在一处，
 * 供 docDefinition 与 toPdfTable 共同引用。
 */
export const PAGE = {
  size: 'A4',
  // 报告表格列多，横向排版才放得下
  orientation: 'landscape',
  /** A4 横向的宽度（磅） */
  width: 841.89,
  /** 上下左右页边距：[左, 上, 右, 下] */
  margins: [28, 32, 28, 36],
}

/** 正文可用宽度（磅） */
export const CONTENT_WIDTH = PAGE.width - PAGE.margins[0] - PAGE.margins[2]

/**
 * 表格的内边距与线宽。
 *
 * pdfmake 的 widths 指的是单元格「内容」宽度，内边距和边框会额外叠加，
 * 计算列宽时必须先把这部分开销扣掉，否则表格会超出页面。
 */
export const TABLE_METRICS = { cellPaddingX: 4, cellPaddingY: 3, lineWidth: 0.4 }

/**
 * 报告 PDF 的配色，取自页面所用的 Tailwind 色板，保证观感一致
 */
export const COLORS = {
  heading: '#1e293b',
  text: '#334155',
  muted: '#64748b',
  placeholder: '#94a3b8',
  border: '#e2e8f0',
  tableHeaderBg: '#f1f5f9',
  summaryRowBg: '#eff6ff',
  accent: '#2563eb',
  accentBg: '#eff6ff',
  pass: '#16a34a',
  fail: '#dc2626',
}

/**
 * 文档样式表，供 docDefinition.styles 使用
 */
export const STYLES = {
  reportTitle: { fontSize: 20, bold: true, color: COLORS.heading, margin: [0, 0, 0, 6] },
  reportSubtitle: { fontSize: 10, color: COLORS.muted, margin: [0, 0, 0, 16] },
  sectionTitle: { fontSize: 13, bold: true, color: COLORS.heading, margin: [0, 16, 0, 8] },
  subTitle: { fontSize: 10, bold: true, color: COLORS.text, margin: [0, 10, 0, 6] },
  tableHeader: { bold: true, fontSize: 8, color: COLORS.heading, fillColor: COLORS.tableHeaderBg },
  metricValue: { fontSize: 14, bold: true, color: COLORS.heading },
  metricLabel: { fontSize: 8, color: COLORS.muted },
  scoreValue: { fontSize: 30, bold: true },
  scoreLabel: { fontSize: 9, color: COLORS.muted },
  cardTitle: { fontSize: 10, bold: true, color: COLORS.heading, margin: [0, 0, 0, 4] },
  cardBody: { fontSize: 9, color: COLORS.text, lineHeight: 1.4 },
  note: { fontSize: 9, color: COLORS.muted, lineHeight: 1.4 },
  footer: { fontSize: 8, color: COLORS.placeholder },
}

/**
 * 自定义表格边框样式
 *
 * pdfmake 内置 layout 的默认边框偏重，报告里表格多，用更细的分割线更耐看。
 */
export const TABLE_LAYOUTS = {
  reportTable: {
    hLineWidth: (rowIndex, node) =>
      rowIndex === 0 || rowIndex === 1 || rowIndex === node.table.body.length
        ? 0.8
        : TABLE_METRICS.lineWidth,
    vLineWidth: () => TABLE_METRICS.lineWidth,
    hLineColor: (rowIndex) => (rowIndex <= 1 ? COLORS.placeholder : COLORS.border),
    vLineColor: () => COLORS.border,
    paddingLeft: () => TABLE_METRICS.cellPaddingX,
    paddingRight: () => TABLE_METRICS.cellPaddingX,
    paddingTop: () => TABLE_METRICS.cellPaddingY,
    paddingBottom: () => TABLE_METRICS.cellPaddingY,
  },
  /** 无边框布局，用于并排的卡片式内容 */
  plain: {
    hLineWidth: () => 0,
    vLineWidth: () => 0,
    paddingLeft: () => 0,
    paddingRight: () => 0,
    paddingTop: () => 0,
    paddingBottom: () => 0,
  },
}

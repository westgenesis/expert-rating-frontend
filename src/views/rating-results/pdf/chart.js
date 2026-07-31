import { init, use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { buildPieOption } from '@/components/pie-chart-option'

use([CanvasRenderer, LegendComponent, TooltipComponent, PieChart])

/** 离屏画布尺寸（CSS 像素），比例与页面上的图表区域接近 */
const CHART_WIDTH = 560
const CHART_HEIGHT = 300

/** 输出倍率，保证 PDF 里放大查看依然清晰 */
const PIXEL_RATIO = 2

/**
 * 把饼图渲染成 PNG DataURL
 *
 * 不复用页面上的图表实例：页面实例只有 300px 高且随布局变化，直接取图会糊。
 * 这里用固定尺寸的离屏实例重新画一遍，配置与页面完全一致。
 * @param {Record<string, number>} data - 分类名到数值的映射
 * @param {(key: string, value: number) => object} [getItemStyle] - 扇区样式回调
 * @returns {string} PNG 的 DataURL，无数据时返回空串
 */
export const renderPieToDataUrl = (data, getItemStyle) => {
  if (!data || !Object.keys(data).length) return ''

  const container = document.createElement('div')
  container.style.width = `${CHART_WIDTH}px`
  container.style.height = `${CHART_HEIGHT}px`

  // 元素未挂载到文档时 ECharts 量不到尺寸，必须显式传入
  const chart = init(container, null, { width: CHART_WIDTH, height: CHART_HEIGHT })

  try {
    // 关掉动画，否则首帧取到的是动画中间态
    chart.setOption({ ...buildPieOption(data, getItemStyle), animation: false })
    return chart.getDataURL({ type: 'png', pixelRatio: PIXEL_RATIO, backgroundColor: '#ffffff' })
  } catch (error) {
    console.error('生成缺陷频率分布图失败:', error)
    return ''
  } finally {
    chart.dispose()
  }
}

/** 饼图在 PDF 中的展示宽度（磅） */
export const PIE_IMAGE_WIDTH = 300

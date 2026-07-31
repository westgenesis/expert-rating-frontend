/** 图例文字的最大显示长度，超出截断 */
const LEGEND_LABEL_MAX = 10

/**
 * 构造饼图的 ECharts 配置
 *
 * 页面上的 PieChart 组件与 PDF 导出的离屏渲染共用这份配置，
 * 保证导出的图表和用户在页面上看到的一致。
 * @param {Record<string, number>} data - 分类名到数值的映射
 * @param {(key: string, value: number) => object} [getItemStyle] - 扇区样式回调
 * @returns {object} ECharts option
 */
export const buildPieOption = (data, getItemStyle) => ({
  legend: {
    orient: 'horizontal',
    left: 'top',
    top: 'top',
    icon: 'circle',
    align: 'left',
    itemWidth: 10,
    itemHeight: 10,
    itemGap: 20,
    textStyle: {
      width: 100,
      overflow: 'truncate',
      fontSize: 12,
      color: '#333',
    },
    type: 'scroll',
    formatter: (name) => {
      const value = data?.[name]
      if (value === undefined) return name
      const text = `${name} (${value})`
      return text.length > LEGEND_LABEL_MAX ? `${text.slice(0, LEGEND_LABEL_MAX)}...` : text
    },
  },
  series: [
    {
      type: 'pie',
      radius: '100%',
      center: ['50%', '50%'],
      data: Object.keys(data || {}).map((key) => {
        const value = data[key]
        return {
          name: key,
          value,
          itemStyle: getItemStyle ? getItemStyle(key, value) : {},
          label: { show: value !== 0 },
          labelLine: { show: value !== 0 },
        }
      }),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      labelLine: {
        show: false,
      },
      label: {
        show: true,
        position: 'inside',
        formatter: '{d}%',
      },
    },
  ],
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)',
  },
})

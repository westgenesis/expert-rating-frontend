import { TABLE_LAYOUTS } from './styles'

/** 报告 PDF 使用的字体族名，需与 docDefinition 的 defaultStyle.font 一致 */
export const PDF_FONT_FAMILY = 'NotoSansSC'

/**
 * 字体文件路径。
 *
 * pdfmake 自带的 Roboto 不含汉字，必须自备中文字体。这两个文件是
 * scripts/build-pdf-fonts.sh 生成的 GB2312 子集，各约 2.2MB，放在 public/
 * 下与页面同源加载 —— 生产是内网 nginx，公网 CDN 不可达。
 */
const FONT_FILES = {
  normal: '/fonts/NotoSansSC-Regular.ttf',
  bold: '/fonts/NotoSansSC-Bold.ttf',
}

/** pdfmake 实例缓存，避免重复导入与重复注册 */
let pdfMakePromise = null

/**
 * 把站内路径补成绝对地址
 *
 * pdfmake 的 URL 协议要求 http(s) 开头的完整地址，相对路径不被接受。
 * @param {string} path - 以 / 开头的站内路径
 * @returns {string} 绝对 URL
 */
const toAbsoluteUrl = (path) => new URL(path, window.location.origin).href

/**
 * 按需加载 pdfmake，并完成字体与表格样式注册
 *
 * pdfmake 本体加上两个字体子集有数 MB，只在用户真正点击导出时才加载，
 * 不进首屏包；加载结果缓存，后续导出直接复用。
 * @returns {Promise<object>} 初始化完成的 pdfmake 实例
 */
export const loadPdfMake = () => {
  if (pdfMakePromise) return pdfMakePromise

  pdfMakePromise = import('pdfmake/build/pdfmake')
    .then((module) => {
      const pdfMake = module.default || module

      const regularUrl = toAbsoluteUrl(FONT_FILES.normal)
      const boldUrl = toAbsoluteUrl(FONT_FILES.bold)

      pdfMake.addFonts({
        [PDF_FONT_FAMILY]: {
          normal: regularUrl,
          bold: boldUrl,
          // 中文没有真正的斜体字形，斜体回落到常规/加粗，避免 pdfmake 报缺字体
          italics: regularUrl,
          bolditalics: boldUrl,
        },
      })

      pdfMake.addTableLayouts(TABLE_LAYOUTS)

      // 只允许加载本站资源，避免文档内容里的外链被顺带请求
      pdfMake.setUrlAccessPolicy((url) => url.startsWith(window.location.origin))

      return pdfMake
    })
    .catch((error) => {
      // 失败后清空缓存，让用户重试时能重新加载
      pdfMakePromise = null
      throw error
    })

  return pdfMakePromise
}

# expert-rating-frontend

一汽TPA平台 - 专家评分系统前端

## 项目基础框架
使用vue3+vite+NaiveUI

## 项目环境
安装[volta](https://docs.volta.sh/guide/getting-started)
用于管理node和npm版本
```bash
curl https://get.volta.sh | bash
```

默认cd进入项目后会自动安装项目node依赖。

## 启动项目
```bash
npm install
npm run dev
```

## 打包项目
```bash
npm run build
```

## 项目部署
使用docker-compose部署
```bash
docker-compose up -d
```

## PDF 报告导出

评测报告的 PDF 由前端用 [pdfmake](https://pdfmake.github.io/docs/) 直接生成并下载，不走浏览器打印。

表格的列定义集中在 `src/views/rating-results/report-schema.js`，页面的 `n-data-table` 与 PDF 共用同一份定义 —— **新增或修改报告里的列，只改这个文件**，两端会同步生效。

### 表格排版

列定义里的 `pdfWidth` 是**相对权重**，不是 pdfmake 的宽度语法。`toPdfTable` 会按权重把页面可用宽度等比分配成绝对宽度，所以表格宽度恒定，不会被某条超长数据撑出页面。这一点不要改回 `'*'` / `'auto'`：pdfmake 会按最长的不可断词计算列的最小宽度，正文里出现一个长编号或 URL 就足以让整张表溢出到页面外。同理，长表格默认允许行内跨页（`dontBreakRows: false`），否则比一页还高的行会被整体挤到下一页并渲染不出来，产生大量空白页。

### 中文字体

pdfmake 自带的 Roboto 不含汉字，`public/fonts/` 下的两个字体文件是 Noto Sans SC 按 GB2312 取的子集（各约 2.3MB），已提交到仓库，正常开发不需要重新生成。

仅在更换字体或需要扩大字符集时执行：

```bash
pip install fonttools brotli
bash scripts/build-pdf-fonts.sh
```

字体只在用户点击导出时按需加载，不进首屏包；生产环境由 nginx 压缩并缓存。因为部署在内网，字体必须与页面同源，不能改用公网 CDN。

## 项目代理

### 开发环境 
本地开发环境使用vite进行开发环境代理，配置在vite.config.js中，使用`VITE_API_SERVER_URL`环境变量进行配置。

### 生产环境
生产环境使用nginx做反向代理，配置在nginx.conf中，反向代理到8099端口。
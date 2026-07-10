# ========== 构建阶段 ==========
FROM node:18-alpine AS build

# 设置工作目录
WORKDIR /app

# 拷贝依赖文件并安装依赖
COPY package*.json ./
RUN npm install --frozen-lockfile

# 拷贝源码并构建
COPY . .
RUN npm run build

# ========== 运行阶段 ==========
FROM nginx:alpine

# 删除默认 nginx 静态资源
RUN rm -rf /usr/share/nginx/html/*

# 拷贝构建产物到 nginx 目录
COPY --from=build /app/dist /usr/share/nginx/html

# 可选：自定义 nginx 配置（如有）
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口（默认80）
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
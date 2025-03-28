# 使用 Node.js 作為建置環境
FROM node:18-alpine AS builder

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json（如果有）
COPY package.json package-lock.json ./

# 安裝依賴
RUN npm install

# 複製專案程式碼
COPY . .

# 建置 Vite 應用
RUN npm run build

# 使用 Nginx 作為最終映像檔
FROM nginx:alpine AS runtime
WORKDIR /usr/share/nginx/html

# 複製 `dist` 目錄到 Nginx 的靜態文件目錄
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 Nginx 預設的 HTTP 端口
EXPOSE 80

# 啟動 Nginx
CMD ["nginx", "-g", "daemon off;"]
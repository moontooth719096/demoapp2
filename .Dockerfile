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

# 將生成的靜態文件複製到宿主機
CMD ["sh", "-c", "cp -r /app/dist /output"]
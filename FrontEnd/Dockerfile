# Sử dụng một hình ảnh Node.js có sẵn
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json (hoặc yarn.lock) vào container
COPY package*.json ./

# Cài đặt các dependencies của ứng dụng
RUN npm install use-scan-detection --legacy-peer-deps

RUN npm install --legacy-peer-deps

RUN npm install axios --legacy-peer-deps

RUN npm install sass --legacy-peer-deps

# Sao chép toàn bộ mã nguồn của ứng dụng vào container
COPY . .

# Thiết lập cổng mà ứng dụng sẽ lắng nghe trên trong container
EXPOSE 3000

# Khởi chạy ứng dụng khi container được chạy
CMD ["npm", "run", "dev"]
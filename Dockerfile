# Sử dụng một image cơ sở có hỗ trợ môi trường web như Nginx.
FROM nginx:latest

# Copy tệp HTML vào thư mục của Nginx.
COPY . /usr/share/nginx/html/

# Etapa 1: Compilación con Node.js
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor Web de Producción con Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Si tienes un archivo nginx.conf personalizado descomenta la siguiente línea:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx corre nativamente en el puerto 80 dentro del contenedor
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
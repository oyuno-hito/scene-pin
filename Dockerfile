# Stage 1: Build frontend
FROM node:22-alpine AS frontend-builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Build backend
FROM gradle:8.10-jdk21 AS backend-builder

WORKDIR /app
COPY server/ ./
RUN gradle :api:bootJar --no-daemon

# Stage 3: Runtime
FROM eclipse-temurin:21-jre-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copy backend jar
COPY --from=backend-builder /app/api/build/libs/*.jar app.jar

# Copy frontend static files to serve from Spring Boot
COPY --from=frontend-builder /app/client/dist /app/static

ENV SPRING_RESOURCES_STATIC_LOCATIONS=file:/app/static/
ENV SERVER_PORT=8080

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

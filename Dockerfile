# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Build Spring Boot backend (with embedded frontend)
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY backend/ .
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static
RUN mvn package -q -DskipTests

# Stage 3: Run
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

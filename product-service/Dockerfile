FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /workspace/app

COPY pom.xml .
COPY src src

RUN apk add --no-cache maven
RUN mvn install -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN apk add --no-cache curl

COPY --from=build /workspace/app/target/*.jar product-service.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "product-service.jar"]

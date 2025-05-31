FROM maven:3.9.9-amazoncorretto-21 as build
WORKDIR /app

COPY src /app/src
COPY pom.xml /app

RUN mvn clean package -DskipTests

FROM openjdk:21-jdk

WORKDIR /app

COPY --from=build /app/target/*.jar ./app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
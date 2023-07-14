FROM openjdk:17-jdk-alpine
ARG JAR_FILE=target/*.jar
COPY ./target/qlsc-3.1.0.jar qlsc.jar
# Chạy ứng dụng khi khởi động container
CMD ["java", "-jar", "qlsc.jar"]
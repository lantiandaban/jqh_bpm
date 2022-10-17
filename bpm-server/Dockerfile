FROM 10.1.100.160:85/library/openjdk:8
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY SIMSUN.TTC .
RUN mkdir -p /usr/share/fonts/chinese && cp SIMSUN.TTC /usr/share/fonts/chinese/SIMSUN.TTC && fc-cache
COPY SIMSUN.TTC /usr/share/fonts/chinese/SIMSUN.TTC
COPY target/bpm-server.jar app.jar
ENTRYPOINT exec java $JAVA_OPTS $SKYWALKING_OPTS -jar /app.jar
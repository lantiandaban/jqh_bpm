

package com.srm.config;

import com.google.common.eventbus.AsyncEventBus;
import com.google.common.eventbus.EventBus;
import com.google.common.util.concurrent.ThreadFactoryBuilder;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * 消息总线配置
 *
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
@Configuration
public class  EventBusConfig {

    /**
     * 定义事件总线bean
     *
     * @return 异步线程
     */
    @Bean
    public EventBus eventBus() {
        //  池中所保存的线程数，包括空闲线程。
        int corePoolSize = 8;
        //   池中允许的最大线程数。
        int maximumPoolSize = 180;
        //  当线程数大于核心时，此为终止前多余的空闲线程等待新任务的最长时间。
        long keepAliveTime = 0L;
        // 执行前用于保持任务的队列。此队列仅保持由 execute 方法提交的 Runnable 任务。
        final LinkedBlockingQueue<Runnable> workQueue = new LinkedBlockingQueue<>(512);
        // 线程池 执行程序创建新线程时使用的工厂。
        ThreadFactory namedThreadFactory = new ThreadFactoryBuilder()
                .setNameFormat("triton-eventbus-pool-%d")
                .setDaemon(true).build();
        // 由于超出线程范围和队列容量而使执行被阻塞时所使用的处理程序。被拒绝任务的处理程序，它将抛出 RejectedExecutionException.
        final ThreadPoolExecutor.AbortPolicy handler = new ThreadPoolExecutor.AbortPolicy();
        ExecutorService executorService = new ThreadPoolExecutor(corePoolSize,
                maximumPoolSize,
                keepAliveTime,
                TimeUnit.MILLISECONDS,
                workQueue,
                namedThreadFactory,
                handler);

        return new AsyncEventBus(executorService);
    }
}

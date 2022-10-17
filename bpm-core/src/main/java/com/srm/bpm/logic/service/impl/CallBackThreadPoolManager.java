

package com.srm.bpm.logic.service.impl;

import com.google.common.util.concurrent.ThreadFactoryBuilder;

import java.util.TimerTask;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.TimeUnit;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public class CallBackThreadPoolManager {
    /**
     * 日志记录操作延时
     */
    private static final int OPERATE_DELAY_TIME = 10;
    private static CallBackThreadPoolManager logManager = new CallBackThreadPoolManager();
    /**
     * 异步操作记录日志的线程池
     */
    private final ScheduledThreadPoolExecutor executor;

    private CallBackThreadPoolManager() {

        ThreadFactory namedThreadFactory = new ThreadFactoryBuilder()
                .setNameFormat("toa-log-pool-%d").build();

        executor = new ScheduledThreadPoolExecutor(10, namedThreadFactory);
    }

    public static CallBackThreadPoolManager me() {
        return logManager;
    }

    public void executeLog(TimerTask task) {
        executor.schedule(task, OPERATE_DELAY_TIME, TimeUnit.MILLISECONDS);
    }
}

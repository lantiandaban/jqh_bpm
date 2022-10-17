

package com.srm.bpm.logic.listener;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.ExecutionListener;

import lombok.extern.slf4j.Slf4j;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Slf4j
public class GatewayListener implements ExecutionListener {
    @Override
    public void notify(DelegateExecution execution) {
        log.info("进去监听");
    }
}

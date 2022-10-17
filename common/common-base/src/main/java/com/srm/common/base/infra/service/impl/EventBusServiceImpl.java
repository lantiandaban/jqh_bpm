

package com.srm.common.base.infra.service.impl;

import com.google.common.eventbus.EventBus;

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Service;

import com.srm.common.base.infra.service.EventBusService;


/**
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
@Service
@ConditionalOnBean(EventBus.class)
public class EventBusServiceImpl implements EventBusService {
    private final EventBus eventBus;

    public EventBusServiceImpl(EventBus eventBus) {
        this.eventBus = eventBus;
    }

    @Override
    public <E> void post(E event) {
        this.eventBus.post(event);
    }
}

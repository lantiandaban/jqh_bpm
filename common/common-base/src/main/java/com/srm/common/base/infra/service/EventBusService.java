

package com.srm.common.base.infra.service;

/**
 * 事件总线服务
 *
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
public interface EventBusService {

    /**
     * 发送事件
     *
     * @param event 事件对象
     * @param <E>   事件类型
     */
    <E> void post(E event);


}

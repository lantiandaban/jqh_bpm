

package com.srm.bpm.infra.service;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface SerialNumberLogic {
    /**
     * 根据流水号前缀获取当前流水
     *
     * @param prefix 缓存前缀KEY
     * @param digits 流水号位数
     * @return 流水号
     */
    String serialNumber(String prefix, int digits);


    /**
     * 获取每日轮询的当前流水号
     *
     * @param prefix 缓存前缀KEY
     * @param digits 流水号位数
     * @return 流水号
     */
    String dayPolling(String prefix, int digits);
}

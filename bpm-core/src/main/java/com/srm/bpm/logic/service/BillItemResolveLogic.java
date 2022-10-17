

package com.srm.bpm.logic.service;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface BillItemResolveLogic {
    /**
     * 解析第一个值
     * @param xtype 字段类型
     * @param props 字段属性
     * @param valueStr 字段的值字符串
     * @return 值
     */
    String firstVale(String xtype,String props,String valueStr);
}



package com.srm.bpm.logic.service;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface ProcessFormLogic {
    /**
     * 保存表单元素
     * <p>
     * 1. 解析出表单的字段信息
     * <p>
     * 2. 解析出表单所使用的表达式信息
     * <p>
     * 3. 存储表单信息
     *
     * @param formDesignerDataStr 表单设计
     * @return 是否成功
     */
    boolean saveForm(String formDesignerDataStr);

}

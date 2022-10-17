

package com.srm.bpm.logic.constant;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface AutoAgreeType {
    /**
     * 处理人就是提交人
     */
    String SENDER_IS_APPROVER="1";
    /**
     * 处理人和上一步处理人相同
     */
    String APPROVER_IS_LAST_APPROVER="2";
    /**
     * 处理人审批过
     */
    String APPROVER_IS_AGREE="3";

}

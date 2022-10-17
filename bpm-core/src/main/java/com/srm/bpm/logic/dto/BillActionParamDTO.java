

package com.srm.bpm.logic.dto;

import lombok.Builder;
import lombok.Data;

/**
 * <p> 审批操作参数</p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
@Builder
public class BillActionParamDTO {

    /**
     * 审批单ID
     */
    private long billId;

    /**
     * 审批任务ID
     */
    private String taskId;

    private String targetTaskId;

    /**
     * 审批意见
     */
    private String opinion;

    /**
     * 登录用户
     */
    private String userCode;

    /**
     * 表单字段
     */
    private String formData;
    /**
     * 下一个审批人
     */
    private String nextApprover;
    /**
     * 加签审批人
     */
    private String endorseApprover;
}

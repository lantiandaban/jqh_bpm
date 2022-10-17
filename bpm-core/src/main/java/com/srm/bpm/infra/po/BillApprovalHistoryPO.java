

package com.srm.bpm.infra.po;

import java.util.List;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
public class BillApprovalHistoryPO {
    /**
     * 审批任务ID
     */
    private long id;

    /**
     * 审批单ID
     */
    private long billId;

    /**
     * 审批意见
     */
    private String opinion;

    /**
     * 任务节点
     */
    private String nodeName;
    /**
     * 审批人
     */
    private String userCode;
    private String userName;

    /**
     * 任务状态
     */
    private int status;
    /**
     * 排序
     */
    private long sort;


    /**
     * 审批时间
     */
    private Long dateline;
    /**
     * 创建时间
     */
    private Long createTime;

    /**
     * 任务的key
     */
    private String taskKey;


    private String taskId;

    private String sourceUserCode;
    private String sourceUserName;
    private String targetUserCode;
    private String targetUserName;

    private Integer taskType;
    private Integer targetTaskType;

    private List<BillApprovalHistoryPO> items;
}

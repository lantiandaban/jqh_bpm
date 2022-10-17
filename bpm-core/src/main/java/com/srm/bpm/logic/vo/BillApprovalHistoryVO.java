

package com.srm.bpm.logic.vo;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * <p> 审批历史记录 VO </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class BillApprovalHistoryVO implements Serializable {
    private static final long serialVersionUID = -2037830889914203683L;

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
    private String userName;

    /**
     * 任务状态
     */
    private int status;
    /**
     * 排序
     */
    private Long sort;


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

    private String sourceUserName;
    private String targetUserName;

    private Integer taskType;
    private Integer targetTaskType;

    private List<BillApprovalHistoryVO> items;

}

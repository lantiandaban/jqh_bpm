

package com.srm.bpm.facde.dto;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
public class BillItemDTO {
    /**
     * 审批单主键
     */
    private long id;
    /**
     * 审批单编号
     */
    private String code;
    /**
     * 审批标题
     */
    private String title;
    private String btns;

    private Integer printSize;
    /**
     * 创建时间
     */
    private Integer createTime;

    /**
     * 开始时间
     */
    private Integer startTime;
    /**
     * 完成时间
     */
    private Integer completionTime;

    /**
     * 优先级
     */
    private int priority;
    /**
     * 节点的操作
     */
    private String action;
    /**
     * 是否已读
     */
    private boolean readFlag;

    /**
     * 审批类型
     */
    private long processId;
    /**
     * 审批类型名称
     */
    private String processName;

    /**
     * 审批状态
     */
    private int status;

    /**
     * 任务名称=节点名称
     */
    private String nodeName;


    /**
     * 审批操作
     */
    private int nodeStatus;
    /**
     * 审批时间
     */
    private Integer dateline;


    private String sender;

    private String senderName;

    private String customerName;

    /**
     *  申请发起外部表单地址
     */
    private String formLink;
    private String approveLink;

    private Integer assistant;
}

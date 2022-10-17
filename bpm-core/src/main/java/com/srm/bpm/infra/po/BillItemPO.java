

package com.srm.bpm.infra.po;

import com.srm.bpm.logic.vo.BillItemVO;

import java.io.Serializable;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
public class BillItemPO implements Serializable {

    private static final long serialVersionUID = -7396618574428293029L;
    /**
     * 审批单主键
     */
    private long id;
    /**
     * 审批任务
     */
    private String taskId;
    /**
     * 审批单编号
     */
    private String code;
    /**
     * 审批标题
     */
    private String title;
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
     * 回复数量
     */
    private int replies;
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
     * 任务 节点 名称
     */
    private String nodeName;
    /**
     * 审批状态
     */
    private int nodeStatus;
    /**
     * 审批时间
     * <p>
     * 在抄送列表中，表示抄送时间
     */
    private Integer dateline;

    /**
     * 发起人主键
     */
    private String sender;
    /**
     * 发起人名称
     */
    private String senderName;

    /**
     * 发起人头像
     */
    private String senderAvatar;

    /**
     * 关联数据
     */
    private String associated;
    /**
     * 概要数据
     */
    private String outline;
    /**
     * 是否含有附件
     */
    private boolean attachmentFlag;

    private String customerName;

    private String btns;

    /**
     *  申请发起外部表单地址
     */
    private String formLink;
    private String approveLink;
    private Integer assistant;
    private Integer printSize;

    public BillItemVO toVO(String userCode) {
        BillItemVO billAppItemVO = new BillItemVO();
        billAppItemVO.setId(this.getId());
        billAppItemVO.setBtns(this.getBtns());
        billAppItemVO.setPrintSize(this.getPrintSize());
        billAppItemVO.setTitle(this.getTitle());
        billAppItemVO.setCode(this.getCode());
        billAppItemVO.setNodeName(this.getNodeName());
        billAppItemVO.setPriority(this.getPriority());
        billAppItemVO.setProcessId(this.getProcessId());
        billAppItemVO.setProcessName(this.getProcessName());
        final String sender = this.getSender();
        if (sender.equals(userCode)) {
            billAppItemVO.setReadFlag(true);
        } else {
            billAppItemVO.setReadFlag(this.isReadFlag());
        }
        billAppItemVO.setSender(sender);
        billAppItemVO.setSenderName(this.getSenderName());
        billAppItemVO.setCreateTime(this.getCreateTime());
        billAppItemVO.setStartTime(this.getStartTime());
        billAppItemVO.setCompletionTime(this.getCompletionTime());
        billAppItemVO.setStatus(this.getStatus());
        billAppItemVO.setNodeStatus(this.getNodeStatus());
        billAppItemVO.setDateline(this.getDateline());
        billAppItemVO.setCustomerName(this.getCustomerName());
        billAppItemVO.setFormLink(this.getFormLink());
        billAppItemVO.setApproveLink(this.getApproveLink());
        billAppItemVO.setAction(this.getAction());
        billAppItemVO.setAssistant(this.getAssistant());
        return billAppItemVO;
    }
}

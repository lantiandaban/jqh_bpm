 

package com.srm.bpm.logic.vo;

import com.google.common.base.MoreObjects;

import com.srm.bpm.infra.entity.ToaBillEntity;
import com.srm.bpm.infra.po.ProcessDetailPO;
import com.srm.common.util.datetime.DateTimeUtil;

import java.io.Serializable;
import java.util.Objects;

import lombok.Data;

/**
 * <p>审批列表中的单个数据对象</p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class BillItemVO implements Serializable {
    private static final long serialVersionUID = -5190732190881356554L;
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
    private String btns;

    private Integer printSize;
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
     * 申请发起外部表单地址
     */
    private String formLink;
    private String approveLink;
    private Integer assistant;

    public static BillItemVO toVO(ToaBillEntity bill, ProcessDetailPO processDetailPO) {
        final BillItemVO billVO = new BillItemVO();
        billVO.setCode(bill.getCode());
        billVO.setId(bill.getId());
        billVO.setTitle(bill.getTitle());
        billVO.setCreateTime(DateTimeUtil.unixTime(bill.getCreationTime().toLocalDate()));
        billVO.setPriority(Objects.isNull(bill.getPriority()) ? 1 : bill.getPriority());
        billVO.setProcessId(bill.getProcessId());
        billVO.setSender(bill.getSender());
        billVO.setStartTime(bill.getStartTime());
        billVO.setProcessName(processDetailPO.getName());
        billVO.setStatus(MoreObjects.firstNonNull(bill.getStatus(), 0));
        return billVO;
    }
}

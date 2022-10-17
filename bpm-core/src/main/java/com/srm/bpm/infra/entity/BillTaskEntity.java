 

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 审批单审批人信息
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("bill_task")
public class BillTaskEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 审批单主键
     */
    private Long billId;

    /**
     * 用户编码或者用户id如果系统没有用户编号直接用id
     */
    private String userCode;

    /**
     * 来源用户编号或者主键，记录移交和专办的来源用户
     */
    private String sourceUserCode;

    /**
     * 来源任务主键，记录移交和专办的来源任务
     */
    private Long sourceTaskId;

    /**
     * 转办设置id
     */
    private Long transferId;
    /**
     * 任务类型(1:默认任务，2:加签任务;3:转办任务;4:移交任务)
     */
    private Integer taskType;
    /**
     * 业务流程主键
     */
    private Long processId;

    /**
     * 节点审批人设置id
     */
    private Long nodeApproverId;

    private String nodeName;

    /**
     * 节点状态;1-待审批；2-已同意；3-已拒绝；4-已撤销;5-他人已审批
     */
    private Integer nodeStatus;

    /**
     * 审批时间
     */
    private Integer dateline;

    private String opinion;

    /**
     * 操作
     */
    private String action;

    private String taskId;
    /**
     * 上一个节点任务id
     */
    private String lastTaskId;

    /**
     * 排序次序
     */
    private Long sort;

    private String taskNodeKey;

    private String lastNodeKey;


}

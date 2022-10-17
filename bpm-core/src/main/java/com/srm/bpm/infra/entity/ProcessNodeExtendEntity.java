 

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;

import java.math.BigDecimal;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 业务流程节点
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("process_node_extend")
public class ProcessNodeExtendEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 业务流程主键
     */
    private Long processId;

    private String nodeId;

    private String nodeName;

    private String nodeType;

    private String operations;

    private String nodeSetting;

    private String actionType;

    private String linkType;

    private String nodeAction;


    /**
     * 自动同意规则(1:处理人就是提交人;2:处理人和上一步处理人相同;3处理人审批过;多个已逗号分隔
     */
    private String autoAgree;

    /**
     * 节点显示的按钮
     */
    private String btns;
    /**
     * 是否允许批量审批
     */
    private Integer batchApproval;
    /**
     * 无对应处理人(1:超级管理员处理;2:跳过此步骤;3:不能提交)
     */
    private Integer noApprovalOperation;
    /**
     * 是否允许加签
     */
    private Integer countersignFlag;
    /**
     * 是否手动选择审批人
     */
    private Integer selectApproval;
    /**
     * 自动扭转超时时间
     */
    private BigDecimal autoNextHours;


}

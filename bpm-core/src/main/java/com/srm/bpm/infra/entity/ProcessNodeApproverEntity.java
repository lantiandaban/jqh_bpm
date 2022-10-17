

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;
import lombok.EqualsAndHashCode;
import com.srm.common.base.infra.entity.BaseEntity;

/**
 * <p>
 * 节点审批人
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("process_node_approver")
public class ProcessNodeApproverEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 业务流程主键
     */
    private Long processId;

    /**
     * 节点主键
     */
    private Long nodeExtendId;

    private String nodeId;

    private String express;

    private String expressParams;

    /**
     * 设置时间
     */
    private Integer dateline;

    private String approver;

    private String countersign;

    private Integer weight;



}

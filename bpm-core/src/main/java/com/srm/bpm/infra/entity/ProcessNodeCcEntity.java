 

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("process_node_cc")
public class ProcessNodeCcEntity extends BaseEntity {

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

    private String cc;

    /**
     * 设置时间
     */
    private Integer dateline;


}

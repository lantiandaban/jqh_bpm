

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 节点连线信息
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("process_node_connection")
public class ProcessNodeConnectionEntity extends BaseEntity {

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

    private String title;

    private String express;

    private String expressParams;

    private Integer dateline;


}

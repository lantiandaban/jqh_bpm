

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 流程节点表单字段控制表
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("process_node_form_field")
public class ProcessNodeFormFieldEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 流程主键
     */
    private Long processId;

    private String nodeId;

    /**
     * 表单主键
     */
    private Long formFieldId;

    private String formWidgetName;

    /**
     * 可见标记
     */
    private Integer visibleFlag;

    /**
     * 编辑标记
     */
    private Integer editFlag;


}

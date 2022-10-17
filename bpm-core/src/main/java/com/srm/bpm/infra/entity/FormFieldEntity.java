

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 表单字段
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("form_field")
public class FormFieldEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 表单主键
     */
    private Long formId;

    private String title;

    private String type;

    private String bizType;

    private String widgetName;

    private String valueType;

    private String props;

    private String description;

    private String placeholder;

    /**
     * 必填标记;1-必填;0-非必填
     */
    private Integer required;

    /**
     * 所属明细字段
     */
    private Long fieldId;

    private String datasourceCode;

    /**
     * 显示排序
     */
    private Integer sort;


}



package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 表单表达式
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("form_expression")
public class FormExpressionEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long formId;

    private Long fieldId;

    private String paramOperator;

    private String paramValue;

    private String expression;

    /**
     * 显示排序
     */
    private Integer sort;


}

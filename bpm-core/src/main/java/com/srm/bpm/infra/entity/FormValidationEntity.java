

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
 * @since 2021-07-26
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("form_validation")
public class FormValidationEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 表单主键
     */
    private Long formId;

    /**
     * 验证表达式
     */
    private String expression;


}

 

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 表单扩展功能
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("form_extensions")
public class FormExtensionsEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 表单主键
     */
    private Long formId;

    private String title;

    private String description;

    private String feature;

    private String type;

    private String script;


}

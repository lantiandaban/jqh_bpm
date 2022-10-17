

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 表单设计信息
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("form_desinger")
public class FormDesingerEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 表单id
     */
    private Long formId;

    /**
     * 表单json
     */
    private String desingerJson;

    /**
     * 表单布局
     */
    private String layout;

    /**
     * 表单列
     */
    private String columns;


}

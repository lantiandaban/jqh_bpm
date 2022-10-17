

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
 * @since 2021-07-15
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("form_third")
public class FormThirdEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 名称
     */
    private String name;

    /**
     * 表单id
     */
    private Long formId;


}

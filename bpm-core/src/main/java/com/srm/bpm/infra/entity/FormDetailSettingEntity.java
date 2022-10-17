 

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 表单明细配置
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("form_detail_setting")
public class FormDetailSettingEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 表单主键
     */
    private Long formId;

    /**
     * 业务流程主键
     */
    private Long processId;

    private String templatePath;

    private String accessUrl;

    private String columnMapping;


}

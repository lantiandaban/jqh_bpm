 

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.FieldStrategy;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;

import java.math.BigDecimal;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 表单设置
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("form_setting")
public class FormSettingEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 表单主键
     */
    private Long formId;

    @TableField(updateStrategy = FieldStrategy.IGNORED)
    private String formLink;
    @TableField(updateStrategy = FieldStrategy.IGNORED)
    private String approveLink;
    @TableField(updateStrategy = FieldStrategy.IGNORED)
    private Integer manualStartFlag;
    private BigDecimal approveFormHeight;

    private String printTemplatePath;

    private String printTemplateUrl;

    /**
     * 推送类型;1-每个审批环节都推送;2-审批完成后推送
     */
    private Integer pushType;


}

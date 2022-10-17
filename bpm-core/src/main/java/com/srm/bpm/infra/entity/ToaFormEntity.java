

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 流程表单
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("toa_form")
public class ToaFormEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private String code;

    private String name;

    private String icon;

    /**
     * 流程主键
     */
    private Long processId;

    /**
     * 表单布局列数
     */
    private Integer layout;

    private String style;

    @TableField("table_name_")
    private String tableName;

    private String description;

    private String documentation;

    /**
     * 流程表单标识;0-非流程表单;1-流程表单
     */
    private Integer processFlag;

    /**
     * 前端缓存标记;0-禁用;1-启用
     */
    private Integer clientAppFlag;

    /**
     * 数据范围标记;0-禁用;1-启用
     */
    private Integer dataScopeFlag;

    /**
     * 明细字段标记
     */
    private Integer detailFieldFlag;

    /**
     * 显示排序
     */
    private Integer sort;
    /**
     * 所属组织
     */
    private String blocCode;

}

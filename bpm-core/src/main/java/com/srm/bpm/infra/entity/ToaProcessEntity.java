

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;

import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 业务流程
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("toa_process")
public class ToaProcessEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private String flowId;

    private String name;

    /**
     * 流程类型
     */
    private Long typeId;

    private String domain;

    private String displayName;

    /**
     * 编号规则
     */
    private Long codeId;

    private String enName;

    /**
     * 可用标记.1-启用；2-禁用
     */
    private Integer status;

    /**
     * 关闭标记.0-未关闭;1-关闭
     */
    private Integer closeFlag;

    private String description;

    /**
     * 显示排序
     */
    private Integer sort;

    /**
     * 经典模板
     */
    private Integer classicFlag;

    /**
     * 全部可见
     */
    private Integer publicFlag;

    /**
     * 系统默认
     */
    private Integer defaultFlag;

    private String usageFile;

    private String code;

    /**
     * 图标主键
     */
    private Long iconId;

    private String diagramPath;

    /**
     * 助手
     */
    private Integer assistant;

    /**
     * 流程版本
     */
    private Integer bpmVersion;

    /**
     * 所属组织
     */
    private String blocCode;

}

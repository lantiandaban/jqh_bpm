 

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 流程类型
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("process_type")
public class ProcessTypeEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private String name;

    private String code;

    /**
     * 上级分组
     */
    private Long parentId;

    /**
     * 排序字段
     */
    private Integer sort;

    /**
     * 所属组织
     */
    private String blocCode;

}

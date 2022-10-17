

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 业务流程可见范围
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("process_visual_range")
public class ProcessVisualRangeEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 业务流程主键
     */
    private Long processId;

    /**
     * 可见用户
     */
    private String userCode;

    /**
     * 组织机构主键
     */
    private String organizationCode;

    /**
     * 范围类型;1-部门;2-用户
     */
    private Integer rangeType;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime2;


}

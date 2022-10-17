

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 流程标题规则
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("process_bill_title")
public class ProcessBillTitleEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 业务流程主键
     */
    private Long processId;

    private String formula;

    /**
     * 时间
     */
    private Integer timeFlag;

    private String timePattern;

    /**
     * 流程名称
     */
    private Integer processTitle;

    /**
     * 流程类型名称
     */
    private Integer processType;

    /**
     * 标题表达式是否包含创建者
     */
    private Integer createrFlag;


}

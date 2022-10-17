

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 流程配置
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("process_setting")
public class ProcessSettingEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private String processId;

    /**
     * 允许撤回;1--不允许撤回;0-也许撤回
     */
    private Integer withdrawnFlag;

    /**
     * 也许查看审批日志;1-不允许；0-允许
     */
    private Integer logFlag;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime2;


}

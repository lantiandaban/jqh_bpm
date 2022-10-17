

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 流程设计信息
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("process_desinger")
public class ProcessDesingerEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long processId;

    private String desingerJson;

    private String processXml;

    private String settingJson;


}

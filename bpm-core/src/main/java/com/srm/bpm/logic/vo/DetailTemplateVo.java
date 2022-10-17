

package com.srm.bpm.logic.vo;


import java.util.List;

import lombok.Data;
import com.srm.bpm.infra.entity.FormFieldEntity;

/**
 * <p> </p>
 *
 * @author yishin
 * @version 1.0
 * @since JDK 1.7
 */

@Data
public class DetailTemplateVo {
    /**
     * 模板名称
     */
    private String fileName;
    /**
     * 流程主键
     */
    private long ProcessId;
    /**
     * 模板字段列表
     */
    private List<FormFieldEntity> detailFields;
}

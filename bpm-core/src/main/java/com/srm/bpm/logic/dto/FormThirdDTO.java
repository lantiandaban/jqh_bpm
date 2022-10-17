

package com.srm.bpm.logic.dto;

import java.io.Serializable;
import java.util.List;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
@ApiModel("表单字段映射配置")
public class FormThirdDTO implements Serializable {
    private static final long serialVersionUID = 1267730116571606327L;
    @ApiModelProperty("流程id")
    private Long processId;
    @ApiModelProperty("配置明细项")
    private List<FormThirdItemDTO> itemDTOS;
}

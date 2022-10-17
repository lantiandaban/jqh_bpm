

package com.srm.bpm.facde.dto;

import java.io.Serializable;

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
@ApiModel("流程基本信息")
public class BaseProcessDTO implements Serializable {

    private static final long serialVersionUID = 4484034382767902747L;
    @ApiModelProperty("物理主键")
    private Long id;
    @ApiModelProperty("流程名称")
    private String name;
    @ApiModelProperty("流程编码")
    private String code;
    @ApiModelProperty("流程类型")
    private Long typeId;
    @ApiModelProperty("编号规则")
    private Long codeId;
    @ApiModelProperty("显示名称")
    private String displayName;
    @ApiModelProperty("显示排序")
    private Integer sort;
    @ApiModelProperty("流程附件id")
    private Long iconId;
}

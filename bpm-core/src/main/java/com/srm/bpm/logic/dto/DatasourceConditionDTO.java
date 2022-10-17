

package com.srm.bpm.logic.dto;

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
@ApiModel("数据源条件")
public class DatasourceConditionDTO implements Serializable {

    private static final long serialVersionUID = -4604244582755084492L;
    @ApiModelProperty("主键")
    private Long id;
    @ApiModelProperty("数据源主键")
    private Long datasourceId;

    @ApiModelProperty("条件名")
    private String conditionName;

    @ApiModelProperty("条件编号")
    private String conditionCode;

    @ApiModelProperty("条件输入值")
    private String inputValue;

    /**
     * 允许输入
     */
    @ApiModelProperty("允许输入")
    private Integer inputFlag;

    /**
     * 显示排序
     */
    @ApiModelProperty("显示排序")
    private Integer sort;
}

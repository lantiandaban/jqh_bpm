

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
@ApiModel("数据源字段")
public class DatasourceFiledDTO implements Serializable {

    private static final long serialVersionUID = 2131998811511638034L;
    @ApiModelProperty("主键")
    private Long id;
    /**
     * 数据源主键
     */
    @ApiModelProperty("数据源主键")
    private Long datasourceId;

    @ApiModelProperty("字段名")
    private String filedName;

    @ApiModelProperty("字段编号")
    private String filedCode;

    @ApiModelProperty("字段英文名")
    private String enName;

    @ApiModelProperty("字段类型")
    private String filedType;

    /**
     * 字段排序
     */
    @ApiModelProperty("字段排序")
    private Integer sort;

    @ApiModelProperty("别名")
    private String filedAs;
}

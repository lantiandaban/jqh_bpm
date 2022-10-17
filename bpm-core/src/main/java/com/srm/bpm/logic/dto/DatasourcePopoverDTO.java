

package com.srm.bpm.logic.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.srm.common.util.serialize.StringValueDeserializer;

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
@ApiModel("弹出框信息")
public class DatasourcePopoverDTO {

    @ApiModelProperty("主键")
    private Long id;
    /**
     * 数据源主键
     */
    @ApiModelProperty("数据源主键")
    private Long datasourceId;
    @ApiModelProperty("查询字段")
    @JsonDeserialize(using = StringValueDeserializer.class)
    private String searchFields;
    @ApiModelProperty("标头字段")
    @JsonDeserialize(using = StringValueDeserializer.class)
    private String tableHeadFields;

    /**
     * 分页标记
     */
    @ApiModelProperty("分页标记")
    private Integer pageFlag;

    /**
     * 每页显示条数
     */
    @ApiModelProperty("每页显示条数")
    private Integer pageSize;
}

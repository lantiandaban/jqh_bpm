

package com.srm.bpm.logic.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
@ApiModel("表单字段属性")
public class FormAttrDto {

    @ApiModelProperty("主键")
    private long id;

    @ApiModelProperty("M名称")
    private String name;
    /**
     * 表单描述
     */
    @ApiModelProperty("表单描述")
    private String description;

    @ApiModelProperty("图标")
    private long icon;

    @ApiModelProperty("布局")
    private FormAttrLayoutDto layout;

    @ApiModelProperty("布局")
    private FormAttrStyleDto style;
}

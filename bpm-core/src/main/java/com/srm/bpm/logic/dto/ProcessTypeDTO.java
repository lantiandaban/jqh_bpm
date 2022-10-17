 

package com.srm.bpm.logic.dto;

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
@ApiModel("流程分类对象")
public class ProcessTypeDTO {
    @ApiModelProperty("主键")
    private Long id;
    @ApiModelProperty("名称")
    private String name;

    @ApiModelProperty("编号")
    private String code;

    /**
     * 上级分组
     */
    @ApiModelProperty("上级分组")
    private Long parentId;

    /**
     * 排序字段
     */
    @ApiModelProperty("排序字段")
    private Integer sort;
}



package com.srm.common.base.dto;

import java.io.Serializable;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 描述: DTO基类
 *
 * @author Wang_Bing
 * @version 1.0
 * @since 05/11/2021 15:13
 */
@Setter
@Getter
@ToString
public class BaseDTO implements Serializable {
    @ApiModelProperty("页码")
    private Long page =1L;
    @ApiModelProperty("每页数量")
    private Long limit =10L;

}

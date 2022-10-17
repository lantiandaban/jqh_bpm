

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
@ApiModel("表单配置项")
public class FormThirdItemDTO implements Serializable {

    private static final long serialVersionUID = -9207950932237891409L;

    private Long thirdId;

    /**
     * 第三方
     */

    @ApiModelProperty("第三方字段")
    private String thirdKey;

    /**
     * 表单字段编码
     */
    @ApiModelProperty("表单字段编码")
    private String formFiled;

    /**
     * 描述
     */
    @ApiModelProperty("表单字段描述")
    private String name;
}

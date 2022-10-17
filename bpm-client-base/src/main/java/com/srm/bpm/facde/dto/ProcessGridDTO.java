

package com.srm.bpm.facde.dto;

import java.io.Serializable;

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
@ApiModel
public class ProcessGridDTO implements Serializable {
    private static final long serialVersionUID = -2797504921584609139L;
    @ApiModelProperty("主键")
    private long id;
    @ApiModelProperty("名称")
    private String name;
    @ApiModelProperty("编码")
    private String code;
    @ApiModelProperty("显示名称")
    private String displayName;
    @ApiModelProperty("类型主键")
    private long typeId;
    @ApiModelProperty("类型名称")
    private String typeName;
    @ApiModelProperty("排序")
    private int sort;
    @ApiModelProperty("创建时间")
    private Long createTime;
    @ApiModelProperty("流程主键")
    private String flowId;
    @ApiModelProperty("状态")
    private int status;
    @ApiModelProperty("图标附件id")
    private Long iconId;
    @ApiModelProperty("模板下载url")
    private String url;
    @ApiModelProperty("外部表单url")
    private String formLink;
    @ApiModelProperty("外部表单审批url")
    private String approveLink;
    @ApiModelProperty("是否允许手动启动")
    private Integer manualStartFlag;

}

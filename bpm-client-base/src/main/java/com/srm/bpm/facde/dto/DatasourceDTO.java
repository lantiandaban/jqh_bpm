

package com.srm.bpm.facde.dto;

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
@ApiModel("数据源")
public class DatasourceDTO {
    @ApiModelProperty("主键")
    private Long id;

    @ApiModelProperty("编号")
    private String code;

    @ApiModelProperty("名称")
    private String name;

    @ApiModelProperty("英文名")
    private String enName;

    /**
     * 数据源类型;1-平台数据源;2-动态SQL语句;3-Java实现接口;4-WebService接口;5-http接口;6-Excel文件;7-脚本
     */
    @ApiModelProperty("数据源类型;1-平台数据源;2-动态SQL语句;")
    private Integer dsType;

    @ApiModelProperty("表名")
    private String tableName;

    /**
     * 显示排序
     */
    @ApiModelProperty("显示排序")
    private Integer sort;

    @ApiModelProperty("连接url")
    private String linkUrl;

    @ApiModelProperty("sql语句")
    private String sqlScript;

    /**
     * sql分页标记
     */
    @ApiModelProperty("sql分页标记")
    private Integer pageFlag;

    @ApiModelProperty("java脚本")
    private String javaScript;

    @ApiModelProperty("脚本")
    private String script;

    /**
     * 系统默认
     */
    @ApiModelProperty("系统默认")
    private Integer defaultFlag;
}

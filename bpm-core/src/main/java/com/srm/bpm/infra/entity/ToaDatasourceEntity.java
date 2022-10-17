 

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 数据源
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("toa_datasource")
public class ToaDatasourceEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private String code;

    private String name;

    private String enName;

    /**
     * 数据源类型;1-平台数据源;2-动态SQL语句;3-Java实现接口;4-WebService接口;5-http接口;6-Excel文件;7-脚本
     */
    private Integer dsType;

    private String tableName;

    /**
     * 显示排序
     */
    private Integer sort;

    private String linkUrl;

    private String sqlScript;

    /**
     * sql分页标记
     */
    private Integer pageFlag;

    private String javaScript;

    private String script;

    /**
     * 系统默认
     */
    private Integer defaultFlag;

    /**
     * 所属组织
     */
    private String blocCode;
}

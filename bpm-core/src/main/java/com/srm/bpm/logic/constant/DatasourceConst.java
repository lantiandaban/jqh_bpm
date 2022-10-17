

package com.srm.bpm.logic.constant;

/**
 * <p> 数据源类型</p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
public interface DatasourceConst {
    /**
     * 平台数据源
     */
    int DS_PLATFORM = 1;
    /**
     * 动态SQL语句
     */
    int DS_SQL = 2;
    /**
     * Java数据接口
     */
    int DS_JAVA = 3;
    /**
     * WebService接口
     */
    int DS_WSDL = 4;
    /**
     * http接口
     */
    int DS_HTTP = 5;
    /**
     * Excel文件
     */
    int DS_EXCEL = 6;
    /**
     * 脚本
     */
    int DS_SCRIPT = 7;

    /**
     * 数据源的条件赋值
     */
    String MASK_WHERE_SQL = "${WHERE_PARAMS}";

    // 系统自带的几个固定数据源

    String DATASOURCE_PROJECT = "ds_project";
    String DATASOURCE_CUSTOMER = "ds_customer";
}

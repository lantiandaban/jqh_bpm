 

package com.srm.bpm.infra.dao;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.bpm.infra.po.TableFieldPO;
import com.srm.bpm.logic.dto.FormTableDto;
import com.srm.bpm.logic.dto.FormTableFieldDto;

import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface FormTableDao {

    @InterceptorIgnore(tenantLine = "true")
    List<Map<String, Object>> executeSelectSql(@Param("sql")Map<String, Object> param);

    /**
     * 查询系统数据库名称
     *
     * @return 数据库名称集合
     */
    @InterceptorIgnore(tenantLine = "true")
    List<String> mysqlQueryTables();

    /**
     * 取得某个表字段的信息
     *
     * @param tableName 表明
     * @return 字段信息
     */
    @InterceptorIgnore(tenantLine = "true")
    List<TableFieldPO> findColumnByTableName(@Param("tableName") String tableName);

    /**
     * 从指定数据库中，查询符合表明的表的数量
     *
     * @param tableName 表名称
     * @return 存在的表名
     */
    @InterceptorIgnore(tenantLine = "true")
    int selectTableSize(@Param("tableName") String tableName);

    /**
     * 从指定数据库中，查询是否存在某张表
     *
     * @param tableName 表名称
     * @return 存在的表名
     */
    @InterceptorIgnore(tenantLine = "true")
    String isTargetTableExistInDB(@Param("tableName") String tableName);

    /**
     * 创建一个数据表
     *
     * @param table  表的相关信息
     * @param fields 字段信息
     * @return 操作行数
     */
    @InterceptorIgnore(tenantLine = "true")
    int createMainTable(@Param("table") FormTableDto table, @Param("fields") List<FormTableFieldDto> fields);

    /**
     * 创建一个表单的明细数据物理表
     *
     * @param table  表的相关信息
     * @param fields 字段信息
     * @return 操作行数
     */
    @InterceptorIgnore(tenantLine = "true")
    int createDetailTable(@Param("table") FormTableDto table, @Param("fields") List<FormTableFieldDto> fields);

    @InterceptorIgnore(tenantLine = "true")
    List<String> selectColumnNameByTableName(@Param("tableName") String tableName);

    /**
     * 向某个表添加字段
     *
     * @param tableName 添加对应表
     * @param fields    要添加的字段
     * @return 影响的行数
     */
    @InterceptorIgnore(tenantLine = "true")
    int addColumn(@Param("tableName") String tableName, @Param("field") FormTableFieldDto fields);

    @InterceptorIgnore(tenantLine = "true")
    int executeUpdateSql(Map<String, Object> param);

    @InterceptorIgnore(tenantLine = "true")
    List<Map<String, Object>> executePagingSql(@Param("sql") Map<String, Object> param, Page page);
}

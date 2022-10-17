

package com.srm.bpm.infra.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.List;
import java.util.Map;

import com.srm.bpm.infra.po.TableFieldPO;
import com.srm.bpm.logic.dto.FormTableDto;
import com.srm.bpm.logic.dto.FormTableFieldDto;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface FormTableService {
    /**
     * 执行指定参数的SQL
     *
     * @param sql   sql
     * @param param sql参数
     * @return 返回执行的sql结果集集合
     */
    List<Map<String, Object>> executeSelectSql(String sql, Map<String, Object> param);

    /**
     * 查询系统数据库名称
     *
     * @return 数据库名称集合
     */
    List<String> mysqlQueryTables();

    /**
     * 取得某个表字段的信息
     *
     * @param tableName 表明
     * @return 字段信息
     */
    List<TableFieldPO> findColumnByTableName(String tableName);

    /**
     * 从指当前连接数据库中，查询符合表明的表的数量
     *
     * @param tableName 表名称
     * @return 存在的表名
     */
    int findByTableSize(String tableName);

    /**
     * 从指定数据库中，查询是否存在某张表
     *
     * @param tableName    表名称
     * @return 存在的表名
     */
    String isTargetTableExistInDB(String tableName);

    /**
     * 创建一个数据表
     *
     * @param table  表的相关信息
     * @param fields 字段信息
     * @return 操作行数
     */
    boolean createMainTable(FormTableDto table, List<FormTableFieldDto> fields);

    /**
     * 创建一个表单的明细关联表
     *
     * @param table  表的信息
     * @param fields 表字段
     * @return 是否创建成功
     */
    boolean createDetailTable(FormTableDto table, List<FormTableFieldDto> fields);

    /**
     * 取得某个表字段名的信息
     *
     * @param tableName 表明
     * @return 字段信息
     */
    List<String> findColumnNameByTableName(String tableName);

    /**
     * 向某个表添加字段
     *
     * @param tableName 添加对应表
     * @param fields    要添加的字段
     * @return 影响的行数
     */
    boolean addColumn(String tableName, FormTableFieldDto fields);

    /**
     * 执行指定参数的SQL
     *
     * @param sql   sql
     * @param param sql参数
     * @return sql 是否执行成功
     */
    boolean executeUpdateSql(String sql, Map<String, Object> param);


    /**
     * 分页 执行指定参数的SQL
     *
     * @param paging 分页条件
     * @param sql    sql语句
     * @param param  sql参数
     * @return 返回执行的sql结果集合
     */
    List<Map<String, Object>> executePagingSql(Page<Map<String, Object>> paging, String sql, Map<String, Object> param);
}

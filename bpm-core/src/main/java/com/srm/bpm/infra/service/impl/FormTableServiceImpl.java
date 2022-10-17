

package com.srm.bpm.infra.service.impl;

import com.baomidou.mybatisplus.core.enums.SqlLike;
import com.baomidou.mybatisplus.core.toolkit.sql.SqlUtils;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import com.srm.bpm.infra.dao.FormTableDao;
import com.srm.bpm.infra.po.TableFieldPO;
import com.srm.bpm.infra.service.FormTableService;
import com.srm.bpm.logic.dto.FormTableDto;
import com.srm.bpm.logic.dto.FormTableFieldDto;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Service
@RequiredArgsConstructor
public class FormTableServiceImpl implements FormTableService {
    private final FormTableDao formFormTableMapper;

    /**
     * 执行指定参数的SQL
     *
     * @param sql   sql
     * @param param sql参数
     * @return 返回执行的sql结果集集合
     */
    @Override
    public List<Map<String, Object>> executeSelectSql(String sql, Map<String, Object> param) {
        param.put("_sql", sql);
        return this.formFormTableMapper.executeSelectSql(param);
    }

    /**
     * 查询系统数据库名称
     *
     * @return 数据库名称集合
     */
    @Override
    public List<String> mysqlQueryTables() {
        return formFormTableMapper.mysqlQueryTables();
    }

    /**
     * 取得某个表字段的信息
     *
     * @param tableName 表明
     * @return 字段信息
     */
    @Override
    public List<TableFieldPO> findColumnByTableName(String tableName) {
        return formFormTableMapper.findColumnByTableName(tableName);
    }

    /**
     * 从指当前连接数据库中，查询符合表明的表的数量
     *
     * @param tableName 表名称
     * @return 存在的表名
     */
    @Override
    public int findByTableSize(String tableName) {
        return this.formFormTableMapper.selectTableSize(SqlUtils.concatLike(tableName, SqlLike.RIGHT));
    }

    /**
     * 从指定数据库中，查询是否存在某张表
     *
     * @param tableName 表名称
     * @return 存在的表名
     */
    @Override
    public String isTargetTableExistInDB(String tableName) {
        return formFormTableMapper.isTargetTableExistInDB(tableName);
    }

    /**
     * 创建一个数据表
     *
     * @param table  表的相关信息
     * @param fields 字段信息
     * @return 操作行数
     */
    @Override
    public boolean createMainTable(FormTableDto table, List<FormTableFieldDto> fields) {
        final int updateRow = formFormTableMapper.createMainTable(table, fields);
        return updateRow > 0;
    }

    @Override
    public boolean createDetailTable(FormTableDto table, List<FormTableFieldDto> fields) {
        final int updateRow = formFormTableMapper.createDetailTable(table, fields);
        return updateRow > 0;
    }

    @Override
    public List<String> findColumnNameByTableName(String tableName) {
        return formFormTableMapper.selectColumnNameByTableName(tableName);
    }

    /**
     * 向某个表添加字段
     *
     * @param tableName 添加对应表
     * @param fields    要添加的字段
     * @return 影响的行数
     */
    @Override
    public boolean addColumn(String tableName, FormTableFieldDto fields) {
        final int updateRow = formFormTableMapper.addColumn(tableName, fields);
        return updateRow > 0;
    }

    /**
     * 执行指定参数的SQL
     *
     * @param sql   sql
     * @param param sql参数
     * @return sql 是否执行成功
     */
    @Override
    public boolean executeUpdateSql(String sql, Map<String, Object> param) {
        param.put("_sql", sql);
        if (sql.contains("set  WHERE id_=#{id_}")) {
            return true;
        }
        int rows = this.formFormTableMapper.executeUpdateSql(param);
        return rows >= 0;
    }

    /**
     * 分页 执行指定参数的SQL
     *
     * @param paging 分页条件
     * @param sql    sql语句
     * @param param  sql参数
     * @return 返回执行的sql结果集合
     */
    @Override
    public List<Map<String, Object>> executePagingSql(Page<Map<String, Object>> paging, String sql, Map<String, Object> param) {
        param.put("_sql", sql);
        return formFormTableMapper.executePagingSql(param, paging);
    }
}

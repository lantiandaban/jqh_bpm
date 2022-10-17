

package com.srm.bpm.logic.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.bpm.logic.dto.DataSourceFormDTO;
import com.srm.bpm.logic.dto.DatasourceComboDTO;
import com.srm.bpm.logic.dto.DatasourceConditionDTO;
import com.srm.bpm.facde.dto.DatasourceDTO;
import com.srm.bpm.logic.dto.DatasourcePopoverDTO;
import com.srm.bpm.logic.dto.ZZTableField;
import com.srm.bpm.logic.vo.DatasourceVO;

import java.util.List;
import java.util.Map;

import cn.hutool.core.lang.Pair;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface DataSourceLogic {
    /**
     * 数据源id获取下拉框信息
     *
     * @param id 数据源id
     * @return 数据源对象
     */
    DatasourceComboDTO getComboByDatasourceId(long id);

    /**
     * 通过数据源id获取 条件值
     *
     * @param id 数据源id
     */
    List<DatasourceConditionDTO> getConditionByDataSourceId(long id);

    /**
     * 通过数据源id获取 弹出框信息
     *
     * @param id 数据源id
     */
    DatasourcePopoverDTO getPopoverByDataSourceId(long id);


    /**
     * 执行sql检测sql是否正确
     *
     * @param sqlscript sql
     * @param empty     参数
     * @param o         参数
     */
    List<Map<String, Object>> executeSql(String sqlscript, String empty, String o);

    /**
     * 查询sql的列
     *
     * @param sqlscript    sql语句
     * @param dataSourceId 数据源id
     * @return sql列集合
     */
    List<ZZTableField> getSqlSelectColumns(String sqlscript, long dataSourceId);

    /**
     * 分页查询数据源
     *
     * @param pageNo   当前页
     * @param pageSize 页容量
     * @return 数据和总数量
     */
    Pair<List<DatasourceDTO>, Long> getDatasourceByPage(Integer pageNo, Integer pageSize);

    /**
     * 保存数据源
     *
     * @param dataSourceFormDTO 数据源保存对象
     * @param userCode          用户编号
     * @return 是否成功
     */
    boolean saveDataSource(DataSourceFormDTO dataSourceFormDTO, String userCode);

    /**
     * 批量删除数据源
     *
     * @param datasourceIds 数据源id
     * @return 是否成功
     */
    boolean batchDeleteDatasource(List<String> datasourceIds);

    /**
     * 查询系统数据库名称
     *
     * @return 数据库名称集合
     */
    List<String> mysqlQueryTables();

    /**
     * 获取某个表的字段信息以及对应设置的信息
     *
     * @param tableName    表名
     * @param dataSourceId 数据源id
     * @return 字段信息集合
     */
    List<ZZTableField> ganerateTableFields(String tableName, long dataSourceId);

    /**
     * 获取数据源详情
     *
     * @param id 数据源id
     * @return 详情信息
     */
    DataSourceFormDTO getDetailById(Long id);

    /**
     * 查找所有数据源
     *
     * @return 数据源
     */
    List<DatasourceVO> getAllWithForm();


    /**
     * 执行数据源接口 返回列表数据
     *
     * @param table  数据源编码
     * @param queryMap  查询条件
     * @param paging 分页参数
     * @return 显示信息
     */
    List<Map<String, Object>> execWithSelect(String table, Map<String, Object> queryMap, Page<Map<String, Object>> paging, String userCode);

    /**
     * 执行查询数据源接口 返回单条结果
     * @param table 表名
     * @param field 列明
     * @param query 查询的参数
     * @param userCode 当前登录员工id
     * @return 单条数据
     */
    Map<String, Object> execLinkquery(String table, String field, String query, String userCode);
}

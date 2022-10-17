

package com.srm.bpm.logic.service.impl;

import com.google.common.base.MoreObjects;
import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import com.alibaba.druid.sql.ast.SQLExpr;
import com.alibaba.druid.sql.ast.SQLOrderBy;
import com.alibaba.druid.sql.ast.statement.SQLSelectItem;
import com.alibaba.druid.sql.dialect.mysql.ast.statement.MySqlSelectQueryBlock;
import com.alibaba.druid.sql.dialect.mysql.parser.MySqlSelectParser;
import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.enums.SqlLike;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.core.toolkit.sql.SqlUtils;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.bpm.facde.dto.DatasourceDTO;
import com.srm.bpm.infra.entity.DatasourceComboEntity;
import com.srm.bpm.infra.entity.DatasourceConditionsEntity;
import com.srm.bpm.infra.entity.DatasourceFiledEntity;
import com.srm.bpm.infra.entity.DatasourcePopoverEntity;
import com.srm.bpm.infra.entity.ToaDatasourceEntity;
import com.srm.bpm.infra.po.TableFieldPO;
import com.srm.bpm.infra.service.DatasourceComboService;
import com.srm.bpm.infra.service.DatasourceConditionsService;
import com.srm.bpm.infra.service.DatasourceFiledService;
import com.srm.bpm.infra.service.DatasourcePopoverService;
import com.srm.bpm.infra.service.FormTableService;
import com.srm.bpm.infra.service.ToaDatasourceService;
import com.srm.bpm.logic.constant.DatasourceConst;
import com.srm.bpm.logic.constant.ProcessCode;
import com.srm.bpm.logic.constant.StringPool;
import com.srm.bpm.logic.converts.DataSourceBasicConvert;
import com.srm.bpm.logic.dto.DataSourceFormDTO;
import com.srm.bpm.logic.dto.DatasourceComboDTO;
import com.srm.bpm.logic.dto.DatasourceConditionDTO;
import com.srm.bpm.logic.dto.DatasourcePagingDto;
import com.srm.bpm.logic.dto.DatasourcePopoverDTO;
import com.srm.bpm.logic.dto.ZZTableField;
import com.srm.bpm.logic.service.DataSourceLogic;
import com.srm.bpm.logic.vo.DatasourceComboPropVO;
import com.srm.bpm.logic.vo.DatasourceFieldVO;
import com.srm.bpm.logic.vo.DatasourcePopoverVO;
import com.srm.bpm.logic.vo.DatasourceVO;
import com.srm.bpm.logic.vo.LabelFieldVO;
import com.srm.bpm.logic.constant.DatasourceParamConst;
import com.srm.common.data.exception.RbException;
import com.srm.common.util.serialize.JsonMapper;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.lang.Pair;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;

import static com.srm.bpm.logic.error.BillCode.DATASOURCE_CODE_EXIST;
import static com.srm.bpm.logic.error.BillCode.DATASOURCE_CONDITION_DEL_ERROR;
import static com.srm.bpm.logic.error.BillCode.DATASOURCE_CONDITION_SAVE_ERROR;
import static com.srm.bpm.logic.error.BillCode.DATASOURCE_EJECT_DEL_ERROR;
import static com.srm.bpm.logic.error.BillCode.DATASOURCE_EJECT_SAVE_ERROR;
import static com.srm.bpm.logic.error.BillCode.DATASOURCE_FIELD_SAVE_ERROR;
import static com.srm.bpm.logic.error.BillCode.DATASOURCE_FILED_DEL_ERROR;
import static com.srm.bpm.logic.error.BillCode.DATASOURCE_SELECT_DEL_ERROR;
import static com.srm.bpm.logic.error.BillCode.DATASOURCE_SELECT_SAVE_ERROR;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Service
@RequiredArgsConstructor
public class DataSourceLogicImpl implements DataSourceLogic {
    private final DatasourceComboService datasourceComboService;
    private final DatasourceConditionsService datasourceConditionsService;
    private final DatasourcePopoverService datasourcePopoverService;
    private final FormTableService formTableService;
    private final DatasourceFiledService dataSourceFiledService;
    private final ToaDatasourceService toaDatasourceService;
    private final DataSourceBasicConvert dataSourceBasicConvert;

    /**
     * 数据源id获取下拉框信息
     *
     * @param id 数据源id
     * @return 数据源对象
     */
    @Override
    public DatasourceComboDTO getComboByDatasourceId(long id) {
        final DatasourceComboEntity comboEntity =
                datasourceComboService.getOne(Wrappers.lambdaQuery(DatasourceComboEntity.class)
                        .eq(DatasourceComboEntity::getDatasourceId, id));
        return dataSourceBasicConvert.datasourceComboEntityToDTO(comboEntity);
    }

    /**
     * 通过数据源id获取 条件值
     *
     * @param id 数据源id
     */
    @Override
    public List<DatasourceConditionDTO> getConditionByDataSourceId(long id) {
        final List<DatasourceConditionsEntity> conditionsEntities =
                datasourceConditionsService.list(Wrappers.lambdaQuery(DatasourceConditionsEntity.class)
                        .eq(DatasourceConditionsEntity::getDatasourceId, id));
        return dataSourceBasicConvert.datasourceConditionsEntityToDTO(conditionsEntities);
    }

    /**
     * 通过数据源id获取 弹出框信息
     *
     * @param id 数据源id
     */
    @Override
    public DatasourcePopoverDTO getPopoverByDataSourceId(long id) {
        final DatasourcePopoverEntity popoverServiceOne =
                datasourcePopoverService.getOne(Wrappers.lambdaQuery(DatasourcePopoverEntity.class).eq(DatasourcePopoverEntity::getDatasourceId, id));
        return dataSourceBasicConvert.datasourcePopoverEntityToDTO(popoverServiceOne);
    }

    /**
     * 执行sql检测sql是否正确
     *
     * @param sql     sql
     * @param field   参数
     * @param keyword 参数
     */
    @Override
    public List<Map<String, Object>> executeSql(String sql, String field, String keyword) {
        final String replace =
                StringUtils.replace(sql, DatasourceParamConst.USER_PARAM, "1");
        Map<String, Object> param = Maps.newHashMap();
        final String sql_script;
        if (!Strings.isNullOrEmpty(field)) {
            Map<String, Object> tplParam = Maps.newHashMap();
            tplParam.put("sql", replace);
            tplParam.put("field", field);
            sql_script = StrUtil.format("{sql} AND {field} LIKE #{{field}}", tplParam);
            param.put(field, SqlUtils.concatLike(keyword, SqlLike.DEFAULT));
        } else {
            sql_script = replace;
        }
        param.put("_sql", sql_script);

        try {
            return this.formTableService.executeSelectSql(sql_script, param);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RbException(StringPool.EMPTY, ProcessCode.SQL_SCRIPT_EXCUTE_ERROR);
        }
    }

    /**
     * 查询sql的列
     *
     * @param sqlscript    sql语句
     * @param dataSourceId 数据源id
     * @return sql列集合
     */
    @Override
    public List<ZZTableField> getSqlSelectColumns(String sqlscript, long dataSourceId) {
        final String replace2 = StringUtils.replace(sqlscript, DatasourceParamConst.USER_PARAM, "1");
        Map<String, DatasourceFiledEntity> fieldMap = Maps.newHashMap();
        if (dataSourceId > 0) {
            List<DatasourceFiledEntity> fileds;
            fileds = this.dataSourceFiledService.list(Wrappers.lambdaQuery(DatasourceFiledEntity.class)
                    .eq(DatasourceFiledEntity::getDatasourceId, dataSourceId));
            // 处理数据解析
            for (DatasourceFiledEntity filed : fileds) {
                fieldMap.put(filed.getFiledCode(), filed);
            }
        }
        List<ZZTableField> fieldOptionDtos = Lists.newArrayList();
        MySqlSelectParser selectParser = new MySqlSelectParser(replace2);
        MySqlSelectQueryBlock query = (MySqlSelectQueryBlock) selectParser.query();
        final List<SQLSelectItem> selectList = query.getSelectList();
        for (SQLSelectItem select : selectList) {
            ZZTableField tableField = new ZZTableField();
            final SQLExpr sqlExpr = select.getExpr();
            final String columnName = sqlExpr.getParent().toString();

            if (StringUtils.containsIgnoreCase(columnName, "as")) {
                final String lowerColomn = StringUtils.replace(columnName, "AS", "as");
                final String fieldName = sqlExpr.toString();
                final String replace = StringUtils.replace(lowerColomn, fieldName, StringPool.EMPTY);
                final String newColumnName = StringUtils.replace(replace, "as", StringPool.EMPTY);

                tableField.setFieldName(fieldName);
                tableField.setColumnName(StringUtils.trim(newColumnName));
            } else {
                final String[] columnAss = StringUtils.split(columnName, StringPool.DOT);
                if (columnAss.length > 1) {
                    tableField.setColumnName(columnAss[1]);
                    tableField.setFieldName(columnName);
                } else {
                    tableField.setColumnName(columnName);
                    tableField.setFieldName(columnName);
                }
            }
            // 存在已经配置的
            DatasourceFiledEntity _field = fieldMap.get(tableField.getColumnName());
            if (_field != null) {
                tableField.setDisplayName(_field.getFiledName());
                tableField.setDataType(_field.getFiledType());
                tableField.setSort(_field.getSort());
            }

            fieldOptionDtos.add(tableField);
        }
        return fieldOptionDtos;
    }

    /**
     * 分页查询数据源
     *
     * @param pageNo   当前页
     * @param pageSize 页容量
     * @return 数据和总数量
     */
    @Override
    public Pair<List<DatasourceDTO>, Long> getDatasourceByPage(Integer pageNo, Integer pageSize) {
        final Page<ToaDatasourceEntity> page = toaDatasourceService.page(new Page<>(pageNo, pageSize));
        final List<ToaDatasourceEntity> records = page.getRecords();
        final List<DatasourceDTO> list = dataSourceBasicConvert.datasourcesEntityToDTO(records);
        return new Pair<>(list, page.getTotal());
    }

    /**
     * 保存数据源
     *
     * @param dataSourceFormDTO 数据源保存对象
     * @param userCode          用户编号
     * @return 是否成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean saveDataSource(DataSourceFormDTO dataSourceFormDTO, String userCode) {
        final ToaDatasourceEntity dataSource = dataSourceBasicConvert.datasourceDTOToEntity(dataSourceFormDTO.getDataSource());
        final List<DatasourceFiledEntity> fileds = dataSourceBasicConvert.datasourceFiledDTOToEntity(dataSourceFormDTO.getFileds());
        final List<DatasourceConditionsEntity> conditions = dataSourceBasicConvert.datasourceConditionDTOToEntity(dataSourceFormDTO.getConditions());
        final DatasourceComboEntity combo = dataSourceBasicConvert.datasourceComboDTOToEntity(dataSourceFormDTO.getCombo());
        final DatasourcePopoverEntity popover = dataSourceBasicConvert.datasourcePopoverDTOToEntity(dataSourceFormDTO.getPopover());
        LocalDateTime now = LocalDateTime.now();
        // 生成sql语句
        final Integer dsType = dataSource.getDsType();
        boolean isOk = true;
        if (ObjectUtil.isNotNull(dsType)) {
            if (dsType == DatasourceConst.DS_PLATFORM) {
                if (CollectionUtil.isNotEmpty(fileds)) {
                    String sqlScript;
                    StringBuilder sqlBuild = new StringBuilder("SELECT ");
                    List<String> cloumns = Lists.newArrayList();
                    for (DatasourceFiledEntity filed : fileds) {
                        cloumns.add(filed.getFiledCode());
                    }
                    sqlBuild.append(StrUtil.join(StringPool.COMMA, cloumns)).append(StringPool.SPACE)
                            .append("FROM").append(StringPool.SPACE).append(dataSource.getTableName());
                    sqlScript = sqlAddConditions(sqlBuild, conditions);
                    dataSource.setSqlScript(sqlScript);
                }
            }
            if (dsType == DatasourceConst.DS_SQL) {
                String sqlScript = dataSource.getSqlScript();
                final String replace2 =
                        StringUtils.replace(sqlScript, DatasourceParamConst.USER_PARAM, "1");
                MySqlSelectParser selectParser = new MySqlSelectParser(replace2);
                MySqlSelectQueryBlock query = (MySqlSelectQueryBlock) selectParser.query();
                SQLExpr queryWhere = query.getWhere();
                final SQLOrderBy orderBy = query.getOrderBy();
                String maskWhereSql = DatasourceConst.MASK_WHERE_SQL;
                maskWhereSql = maskWhereSql.replace("$", "\\$");
                maskWhereSql = maskWhereSql.replace("{", "\\{");
                maskWhereSql = maskWhereSql.replace("}", "\\}");
                // todo 动态sql保存逻辑优化
                if (queryWhere == null) { //无where语句
                    if (orderBy != null) { //有order语句
                        final String replace = "WHERE 1=1" + maskWhereSql + StringPool.SPACE + "ORDER";
                        sqlScript = sqlScript.replaceAll("(?i)ORDER", replace);
                    } else { //无order语句
                        StringBuilder sqlBuild = new StringBuilder(sqlScript);
                        sqlScript = sqlBuild.append(StringPool.SPACE).append("WHERE").append(
                                        StringPool.SPACE)
                                .append(StringPool.ONE).append(StringPool.EQUALS).append(
                                        StringPool.ONE).append(StringPool.SPACE)
                                .append(DatasourceConst.MASK_WHERE_SQL)
                                .toString();
                    }
                } else { //有where语句
                    if (orderBy != null) { //有order语句
                        final String replace = maskWhereSql + StringPool.SPACE + "ORDER";
                        sqlScript = sqlScript.replaceAll("(?i)ORDER", replace);
                    } else { //无order语句
                        sqlScript += StringPool.SPACE + DatasourceConst.MASK_WHERE_SQL;
                    }
                }
                dataSource.setSqlScript(sqlScript);
            }
        }

        final long dsId = MoreObjects.firstNonNull(dataSource.getId(), 0L);
        final LambdaQueryWrapper<ToaDatasourceEntity> datasourceLambdaQueryWrapper = Wrappers.lambdaQuery(ToaDatasourceEntity.class);
        if (dsId > 0) {
            datasourceLambdaQueryWrapper.eq(ToaDatasourceEntity::getCode, dataSource.getCode()).ne(ToaDatasourceEntity::getId, dsId);
            final ToaDatasourceEntity one = toaDatasourceService.getOne(datasourceLambdaQueryWrapper);
            if (!Objects.isNull(one)) {
                throw new RbException("编码已存在");
            }
            // 编辑
            dataSource.setUpdateTime(now);
            deleteRefInfo(Lists.newArrayList(dsId + ""));
            isOk = this.toaDatasourceService.upldate(dataSource);
            if (!isOk) {
                throw new RbException("更新信息失败");
            }
        } else {
            dataSource.setCode(IdWorker.get32UUID());
            datasourceLambdaQueryWrapper.eq(ToaDatasourceEntity::getCode, dataSource.getCode());
            final ToaDatasourceEntity one = toaDatasourceService.getOne(datasourceLambdaQueryWrapper);
            if (!Objects.isNull(one)) {
                throw new RbException(DATASOURCE_CODE_EXIST);
            }
            dataSource.setCreationTime(now);
            isOk = this.toaDatasourceService.insert(dataSource);
        }
        // 数据源其它附表更新
        final long dataSourceId = dataSource.getId();
        //更新字段表
        if (CollectionUtil.isNotEmpty(fileds) && isOk) {
            for (DatasourceFiledEntity filed : fileds) {
                filed.setDatasourceId(dataSourceId);
                filed.setCreationTime(now);
            }
            final boolean b = dataSourceFiledService.saveBatch(fileds);
            if (!b) {
                throw new RbException(DATASOURCE_FIELD_SAVE_ERROR);
            }
        }
        //更新条件表
        if (CollectionUtil.isNotEmpty(conditions) && isOk) {
            for (DatasourceConditionsEntity condition : conditions) {
                condition.setId(null);
                condition.setDatasourceId(dataSourceId);
                condition.setCreationTime(now);
            }
            final boolean res = datasourceConditionsService.saveBatch(conditions);
            if (!res) {
                throw new RbException(DATASOURCE_CONDITION_SAVE_ERROR);
            }
        }
        //更新下拉框表
        if (combo != null) {
            combo.setId(null);
            combo.setDatasourceId(dataSourceId);
            combo.setCreationTime(now);
            final boolean res = datasourceComboService.save(combo);
            if (!res) {
                throw new RbException(DATASOURCE_SELECT_SAVE_ERROR);
            }
        }
        //更新弹出框表
        if (popover != null) {
            final String tableHeadFields = popover.getTableHeadFields();
            if (!Strings.isNullOrEmpty(tableHeadFields)) {
                final String tableHeadFieldsParseRes = parseField(tableHeadFields, fileds);
                popover.setTableHeadFields(tableHeadFieldsParseRes);
            }
            final String searchFields = popover.getSearchFields();
            if (!Strings.isNullOrEmpty(searchFields)) {
                final String searchFieldsParseRes = parseField(searchFields, fileds);
                popover.setSearchFields(searchFieldsParseRes);
            }
            popover.setDatasourceId(dataSourceId);
            popover.setCreationTime(now);
            popover.setId(null);
            final boolean res = datasourcePopoverService.insert(popover);
            if (!res) {
                throw new RbException(DATASOURCE_EJECT_SAVE_ERROR);
            }
        }
        return isOk;
    }

    private void deleteRefInfo(List<String> dsId) {
        // 先删除字段信息
        final LambdaQueryWrapper<DatasourceFiledEntity> datasourceFiledLambdaQueryWrapper =
                Wrappers.lambdaQuery(DatasourceFiledEntity.class).in(DatasourceFiledEntity::getDatasourceId, dsId);
        final List<DatasourceFiledEntity> datasourceFileds = this.dataSourceFiledService
                .list(datasourceFiledLambdaQueryWrapper);
        if (CollectionUtil.isNotEmpty(datasourceFileds)) {
            final boolean removeState = this.dataSourceFiledService
                    .remove(datasourceFiledLambdaQueryWrapper);
            if (!removeState) {
                throw new RbException(DATASOURCE_FILED_DEL_ERROR);
            }
        }
        final LambdaQueryWrapper<DatasourceConditionsEntity> conditionsLambdaQueryWrapper =
                Wrappers.lambdaQuery(DatasourceConditionsEntity.class).in(DatasourceConditionsEntity::getDatasourceId, dsId);
        final List<DatasourceConditionsEntity> datasourceConditionss = this
                .datasourceConditionsService.list(conditionsLambdaQueryWrapper);
        if (CollectionUtil.isNotEmpty(datasourceConditionss)) {
            final boolean removeState = this.datasourceConditionsService.remove(conditionsLambdaQueryWrapper);
            if (!removeState) {
                throw new RbException(DATASOURCE_CONDITION_DEL_ERROR);
            }
        }

        final LambdaQueryWrapper<DatasourceComboEntity> datasourceComboLambdaQueryWrapper =
                Wrappers.lambdaQuery(DatasourceComboEntity.class).in(DatasourceComboEntity::getDatasourceId, dsId);
        final DatasourceComboEntity datasourceCombo = this
                .datasourceComboService.getOne(datasourceComboLambdaQueryWrapper);
        if (datasourceCombo != null) {
            final boolean removeState = this.datasourceComboService.remove(datasourceComboLambdaQueryWrapper);
            if (!removeState) {
                throw new RbException(DATASOURCE_SELECT_DEL_ERROR);
            }
        }
        final LambdaQueryWrapper<DatasourcePopoverEntity> datasourcePopoverLambdaQueryWrapper =
                Wrappers.lambdaQuery(DatasourcePopoverEntity.class).in(DatasourcePopoverEntity::getDatasourceId, dsId);
        final DatasourcePopoverEntity datasourcePopover = this
                .datasourcePopoverService.getOne(datasourcePopoverLambdaQueryWrapper);
        if (datasourcePopover != null) {
            final boolean removeState = this.datasourcePopoverService.remove(datasourcePopoverLambdaQueryWrapper);
            if (!removeState) {
                throw new RbException(DATASOURCE_EJECT_DEL_ERROR);
            }
        }
    }

    /**
     * 批量删除数据源
     *
     * @param datasourceIds 数据源id
     * @return 是否成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean batchDeleteDatasource(List<String> datasourceIds) {
        deleteRefInfo(datasourceIds);
        return this.toaDatasourceService.removeByIds(datasourceIds);
    }

    /**
     * 查询系统数据库名称
     *
     * @return 数据库名称集合
     */
    @Override
    public List<String> mysqlQueryTables() {
        return this.formTableService.mysqlQueryTables();
    }

    /**
     * 获取某个表的字段信息以及对应设置的信息
     *
     * @param tableName    表名
     * @param dataSourceId 数据源id
     * @return 字段信息集合
     */
    @Override
    public List<ZZTableField> ganerateTableFields(String tableName, long dataSourceId) {
        List<TableFieldPO> fieldPOS = formTableService.findColumnByTableName(tableName);
        final List<ZZTableField> zzTableFields = dataSourceBasicConvert.tableFieldPOToField(fieldPOS);
        ganerateTableFields(dataSourceId, zzTableFields);
        return zzTableFields;
    }

    /**
     * 获取数据源详情
     *
     * @param datasourceId 数据源id
     * @return 详情信息
     */
    @Override
    public DataSourceFormDTO getDetailById(Long datasourceId) {
        final ToaDatasourceEntity datasource = toaDatasourceService.getById(datasourceId);
        final DatasourcePopoverEntity datasourcePopoverEntity =
                datasourcePopoverService.getOne(Wrappers.lambdaQuery(DatasourcePopoverEntity.class)
                        .eq(DatasourcePopoverEntity::getDatasourceId, datasourceId));
        final DatasourceComboEntity datasourceComboEntity =
                datasourceComboService.getOne(Wrappers.lambdaQuery(DatasourceComboEntity.class)
                        .eq(DatasourceComboEntity::getDatasourceId, datasourceId));
        DataSourceFormDTO dataSourceFormDTO =
                convertToDTO(datasource, datasourcePopoverEntity, datasourceComboEntity);
        return dataSourceFormDTO;
    }

    public DataSourceFormDTO convertToDTO(ToaDatasourceEntity datasourceEntity,
                                                 DatasourcePopoverEntity datasourcePopoverEntity,
                                                 DatasourceComboEntity datasourceComboEntity) {
        DataSourceFormDTO dataSourceFormDTO = new DataSourceFormDTO();
        if (!Objects.isNull(datasourceEntity)) {
            dataSourceFormDTO.setDataSource(dataSourceBasicConvert.datasourceEntityToDTO(datasourceEntity));
        }
        if (!Objects.isNull(datasourceEntity)) {
            dataSourceFormDTO.setPopover(dataSourceBasicConvert.datasourcePopoverEntityToDTO(datasourcePopoverEntity));
        }
        if (!Objects.isNull(datasourceComboEntity)) {
            dataSourceFormDTO.setCombo(dataSourceBasicConvert.datasourceComboEntityToDTO(datasourceComboEntity));
        }
        return dataSourceFormDTO;
    }
    /**
     * 查找所有数据源
     *
     * @return 数据源
     */
    @Override
    public List<DatasourceVO> getAllWithForm() {
        final List<ToaDatasourceEntity> dataSources =
                this.toaDatasourceService.list(Wrappers.lambdaQuery(ToaDatasourceEntity.class).orderBy(true, true, ToaDatasourceEntity::getSort));
        if (CollectionUtil.isEmpty(dataSources)) {
            return Collections.emptyList();
        }
        final List<DatasourceFiledEntity> dataSourceFileds
                = dataSourceFiledService.list(Wrappers.lambdaQuery(DatasourceFiledEntity.class).orderBy(true, true, DatasourceFiledEntity::getSort));
        if (CollectionUtil.isEmpty(dataSourceFileds)) {
            return Collections.emptyList();
        }

        final List<DatasourceComboEntity> comboList =
                datasourceComboService.list(Wrappers.lambdaQuery(DatasourceComboEntity.class).orderBy(true, true, DatasourceComboEntity::getSort));
        final List<DatasourcePopoverEntity> popoverList = datasourcePopoverService.list();
        // 分组
        final Map<Long, List<DatasourceFiledEntity>> groupResultMap
                = dataSourceFileds.stream().collect(Collectors.groupingBy(DatasourceFiledEntity::getDatasourceId));
        final Map<Long, List<DatasourceComboEntity>> comboGroupResultMap
                = comboList.stream().collect(Collectors.groupingBy(DatasourceComboEntity::getDatasourceId));
        final Map<Long, List<DatasourcePopoverEntity>> popoversGroupResultMap
                = popoverList.stream().collect(Collectors.groupingBy(DatasourcePopoverEntity::getDatasourceId));
        List<DatasourceVO> datasourceVOList = Lists.newArrayListWithCapacity(dataSources.size());
        DatasourceVO datasourceVO;
        List<DatasourceFiledEntity> fileds;

        for (ToaDatasourceEntity dataSource : dataSources) {
            datasourceVO = new DatasourceVO();
            datasourceVO.setTable(dataSource.getCode());
            datasourceVO.setName(dataSource.getName());
            final long dataSourceId = MoreObjects.firstNonNull(dataSource.getId(), 0L);
            fileds = groupResultMap.get(dataSourceId);
            if (CollectionUtil.isEmpty(fileds)) {
                continue;
            }
            List<DatasourceFieldVO> fieldVOS = Lists.newArrayList();
            Map<String, DatasourceFieldVO> filedTmpMap = Maps.newHashMap();
            for (DatasourceFiledEntity filed : fileds) {
                DatasourceFieldVO datasourceFieldVO = new DatasourceFieldVO();
                datasourceFieldVO.setField(filed.getFiledCode());
                datasourceFieldVO.setName(filed.getFiledName());
                datasourceFieldVO.setVtype(filed.getFiledType());
                datasourceFieldVO.setFieldAs(filed.getFiledAs());
                fieldVOS.add(datasourceFieldVO);

                filedTmpMap.put(filed.getFiledCode(), datasourceFieldVO);
            }

            datasourceVO.setFields(fieldVOS);
            // 处理其他设置信息
            // 1-分页
            final Collection<DatasourcePopoverEntity> datasourcePopovers = popoversGroupResultMap.get(dataSourceId);
            if (CollectionUtil.isNotEmpty(datasourcePopovers)) {
                int idex = 0;
                for (DatasourcePopoverEntity datasourcePopover : datasourcePopovers) {
                    if (idex > 0) {
                        break;
                    }
                    DatasourcePopoverVO popoverVO = parseGenPopover(datasourcePopover);
                    datasourceVO.setPopover(popoverVO);
                    idex = 1;
                }
            }
            final Collection<DatasourceComboEntity> datasourceCombos = comboGroupResultMap.get(dataSourceId);
            if (CollectionUtil.isNotEmpty(datasourceCombos)) {
                int ci = 0;
                for (DatasourceComboEntity datasourceCombo : datasourceCombos) {
                    if (ci > 0) {
                        break;
                    }
                    DatasourceComboPropVO comboPropVO = parseGenCombo(filedTmpMap, datasourceCombo);
                    datasourceVO.setCombo(comboPropVO);
                    ci = 1;
                }
            }
            datasourceVOList.add(datasourceVO);
            filedTmpMap = null;
        }
        return datasourceVOList;
    }

    /**
     * 执行数据源接口 返回列表数据
     *
     * @param table    数据源编码
     * @param queryMap 查询条件
     * @param paging   分页参数
     * @return 显示信息
     */
    @Override
    public List<Map<String, Object>> execWithSelect(String table, Map<String, Object> queryMap, Page<Map<String, Object>> paging, String userCode) {
        Map<String, String> sqlParams = Maps.newHashMap();
        if (CollectionUtil.isNotEmpty(queryMap)) {
            if (CollectionUtil.isNotEmpty(queryMap)) {
                for (String queryField : queryMap.keySet()) {
                    String value = String.valueOf(queryMap.get(queryField));
                    sqlParams.put(queryField, value);
                }
            }
        }
        final ToaDatasourceEntity datasource =
                toaDatasourceService.getOne(Wrappers.lambdaQuery(ToaDatasourceEntity.class).eq(ToaDatasourceEntity::getCode, table));
        if (datasource == null) {
            throw new RbException(StringPool.EMPTY, ProcessCode.DS_NOT_FOUND);
        }


        final int dsType = MoreObjects.firstNonNull(datasource.getDsType(), 0);
        switch (dsType) {
            case DatasourceConst.DS_PLATFORM:
            case DatasourceConst.DS_SQL:
                String sql = datasource.getSqlScript();

                final List<Map<String, Object>> datas;
                if (sql.contains(DatasourceParamConst.USER_PARAM)) {
                    sql = StringUtils.replace(sql, DatasourceParamConst.USER_PARAM, userCode);
                }
                datas = this.executeSqlWithLike(sql, sqlParams, paging);
                // 对数据进行补偿加工处理

                final List<String> fields;
                final Long datasourceId = datasource.getId();
                fields = dataSourceFiledService.selectFieldsByDatasourceId(datasourceId);

                for (Map<String, Object> resultMapList : datas) {
                    for (String field : fields) {
                        if (!resultMapList.containsKey(field)) {
                            resultMapList.put(field, StringPool.EMPTY);
                        }
                    }
                }
                paging.setRecords(datas);
                return datas;
            default:
                // 暂时不支持其他的类型
                break;
        }
        paging.setRecords(Collections.<Map<String, Object>>emptyList());
        return Collections.emptyList();
    }

    /**
     * 执行查询数据源接口 返回单条结果
     *
     * @param table    表名
     * @param field    列明
     * @param query    查询的参数
     * @param userCode 当前登录员工id
     * @return 单条数据
     */
    @Override
    public Map<String, Object> execLinkquery(String table, String field, String query, String userCode) {
        final ToaDatasourceEntity datasource = toaDatasourceService.findByCode(table);
        if (datasource == null) {
            throw new RbException(StringPool.EMPTY, ProcessCode.DS_NOT_FOUND);
        }

        final int dsType = MoreObjects.firstNonNull(datasource.getDsType(), 0);
        switch (dsType) {
            case DatasourceConst.DS_PLATFORM:
            case DatasourceConst.DS_SQL:
                String sql = datasource.getSqlScript();
                sql = sql.replace("##EMPLOYEEID##", String.valueOf(userCode));
                return this.executeSqlByQuery(sql, field, query);
            default:
                // 暂时不支持其他的类型
                break;
        }

        return null;
    }

    private Map<String, Object> executeSqlByQuery(String sql, String field, String keyword) {
        Map<String, String> sqlParams = Maps.newHashMap();
        sqlParams.put(field, keyword);

        final Pair<String, Map<String, Object>> sqlAndParam = resoleEqualSqlAndParams(sql, sqlParams);
        final String runSql = sqlAndParam.getKey();
        final Map<String, Object> params = sqlAndParam.getValue();

        final List<Map<String, Object>> resultSets;
        resultSets = this.formTableService.executeSelectSql(runSql, params);
        if (CollectionUtil.isNotEmpty(resultSets)) {
            return resultSets.get(0);
        }
        return Collections.emptyMap();
    }

    private Pair<String, Map<String, Object>> resoleEqualSqlAndParams(String sql, Map<String, String> sqlParams) {
        return resoleSqlAndParams(sql, sqlParams, StringPool.EQUALS);
    }

    private List<Map<String, Object>> executeSqlWithLike(String sql, Map<String, String> sqlParams, Page<Map<String, Object>> paging) {
        final Pair<String, Map<String, Object>> sqlAndParam = resoleLikeSqlAndParams(sql, sqlParams);
        final String runSql = sqlAndParam.getKey();
        final Map<String, Object> params = sqlAndParam.getValue();
        return this.formTableService.executePagingSql(paging, runSql, params);
    }

    private Pair<String, Map<String, Object>> resoleLikeSqlAndParams(String sql, Map<String, String> sqlParams) {
        return resoleSqlAndParams(sql, sqlParams, "LIKE");
    }

    /**
     * 解析SQL，替换相关参数 Where 条件，生成动态SQL
     *
     * @param sql       SQL解析
     * @param sqlParams sql参数
     * @param condition sql条件
     * @return 元组，第一个为解析后的sql， 第二个为sql参数
     */
    private Pair<String, Map<String, Object>> resoleSqlAndParams(
            String sql, Map<String, String> sqlParams, String condition
    ) {
        Map<String, Object> param = Maps.newHashMap();

        if (StringUtils.isEmpty(condition)) {
            condition = StringPool.EQUALS;
        }

        final String sql_script;
        if (CollectionUtil.isNotEmpty(sqlParams)) {
            StringBuilder sqlWhereBuilder = new StringBuilder();
            for (String queryField : sqlParams.keySet()) {
                final String queryValue = sqlParams.get(queryField);
                if (Strings.isNullOrEmpty(queryValue)) {
                    continue;
                }
                Map<String, Object> tplParam = Maps.newHashMap();
                final String filedMask = StringUtils.replace(queryField, StringPool.DOT, StringPool.DASH);
                tplParam.put("field", queryField);
                tplParam.put("field_mask", filedMask);
                tplParam.put("condition", condition);
                final String conditionSql;
                conditionSql = StrUtil.format(" AND {field} {condition} #{sql.{field_mask}}", tplParam);
                sqlWhereBuilder.append(conditionSql);
                if (StringUtils.equals(condition, StringPool.EQUALS)) {
                    param.put(filedMask, queryValue);
                } else {
                    param.put(filedMask, SqlUtils.concatLike(queryValue, SqlLike.DEFAULT));
                }

            }
            if (StringUtils.contains(sql, DatasourceConst.MASK_WHERE_SQL)) {
                sql_script = StringUtils.replace(sql, DatasourceConst.MASK_WHERE_SQL,
                        sqlWhereBuilder.toString());
            } else {
                sql_script = sql + sqlWhereBuilder.toString();
            }
        } else {
            if (StringUtils.contains(sql, DatasourceConst.MASK_WHERE_SQL)) {
                sql_script = StringUtils.replace(sql, DatasourceConst.MASK_WHERE_SQL, StringPool.EMPTY);
            } else {
                sql_script = sql;
            }
        }
        return Pair.of(sql_script, param);
    }

    private DatasourceComboPropVO parseGenCombo(Map<String, DatasourceFieldVO> filedTmpMap,
                                                DatasourceComboEntity datasourceCombo) {
        DatasourceComboPropVO propVO = new DatasourceComboPropVO();

        if (datasourceCombo != null) {
            final String displayField = datasourceCombo.getDisplayField();
            if (!Strings.isNullOrEmpty(displayField)) {
                final DatasourceFieldVO displayFieldVO = filedTmpMap.get(displayField);
                propVO.setDisplayField(displayFieldVO);
            }
            final String valueField = datasourceCombo.getValueField();
            if (!Strings.isNullOrEmpty(valueField)) {
                final DatasourceFieldVO valueFieldVO = filedTmpMap.get(valueField);
                propVO.setValueField(valueFieldVO);
            }
        }

        return propVO;
    }

    private DatasourcePopoverVO parseGenPopover(DatasourcePopoverEntity datasourcePopover) {
        DatasourcePopoverVO popoverVO = new DatasourcePopoverVO();
        DatasourcePagingDto pagingVO = new DatasourcePagingDto();
        pagingVO.setEnable(datasourcePopover.getPageFlag() == 1 ? true : false);
        final Integer pageSize = datasourcePopover.getPageSize();
        pagingVO.setPageSize(MoreObjects.firstNonNull(pageSize, 0));
        popoverVO.setPaging(pagingVO);

        final String searchFields = datasourcePopover.getSearchFields();
        if (!Strings.isNullOrEmpty(searchFields)) {
            List<LabelFieldVO> searchFieldList =
                    JSON.parseArray(searchFields, LabelFieldVO.class);
            if (CollectionUtil.isNotEmpty(searchFieldList)) {
                List<DatasourceFieldVO> searchFieldVOS
                        = Lists.newArrayListWithCapacity(searchFieldList.size());
                for (LabelFieldVO vo : searchFieldList) {
                    searchFieldVOS.add(vo.toFieldVO());
                }
                popoverVO.setSearchItems(searchFieldVOS);
            }
        }

        final String tableHeadFields = datasourcePopover.getTableHeadFields();
        if (!Strings.isNullOrEmpty(tableHeadFields)) {
            List<LabelFieldVO> headFields = JSON.parseArray(tableHeadFields, LabelFieldVO.class);
            if (CollectionUtil.isNotEmpty(headFields)) {
                List<DatasourceFieldVO> headFieldList = Lists
                        .newArrayListWithCapacity(headFields.size());
                for (LabelFieldVO vo : headFields) {
                    headFieldList.add(vo.toFieldVO());
                }
                popoverVO.setTableColumns(headFieldList);
            }
        }
        return popoverVO;
    }

    /**
     * 处理数据解析
     *
     * @param dataSourceId 数据源主键
     * @param tableFields  字段信息
     */
    private void ganerateTableFields(long dataSourceId, List<ZZTableField> tableFields) {
        if (dataSourceId > 0) {
            List<DatasourceFiledEntity> fileds;
            fileds = this.dataSourceFiledService.list(Wrappers.lambdaQuery(DatasourceFiledEntity.class)
                    .eq(DatasourceFiledEntity::getDatasourceId, dataSourceId));
            // 处理数据解析
            Map<String, DatasourceFiledEntity> fieldMap = Maps.newHashMap();
            for (DatasourceFiledEntity filed : fileds) {
                fieldMap.put(filed.getFiledCode(), filed);
            }
            for (ZZTableField tableField : tableFields) {
                final String columnName = tableField.getColumnName();
                if (fieldMap.containsKey(columnName)) {
                    // 存在已经配置的
                    DatasourceFiledEntity _field = fieldMap.get(columnName);
                    tableField.setDisplayName(_field.getFiledName());
                    tableField.setDataType(_field.getFiledType());
                    tableField.setSort(_field.getSort());
                }
            }
        }
    }

    /**
     * 弹出框属性格式化
     *
     * @param fields           弹出框接收到的字段列表
     * @param datasourceFileds 数据源使用字段列表
     * @return 格式化后的属性字段
     */
    private String parseField(String fields, List<DatasourceFiledEntity> datasourceFileds) {
        List<Map<String, String>> fieldList = Lists.newArrayList();
        final List<String> fieldStrs = JSON.parseArray(fields, String.class);
        for (String fieldStr : fieldStrs) {
            for (DatasourceFiledEntity datasourceFiled : datasourceFileds) {
                if (fieldStr.contains(datasourceFiled.getFiledCode())) {
                    Map<String, String> fieldTemp = Maps.newHashMap();
                    fieldTemp.put("label", datasourceFiled.getFiledName());
                    fieldTemp.put("field", fieldStr);
                    fieldList.add(fieldTemp);
                }
            }
        }
        return JsonMapper.toJson(fieldList);
    }

    /**
     * sql脚本增加条件方法
     *
     * @param sqlBuild   sql可变字符
     * @param conditions 条件集合
     * @return sql脚本字符
     */
    private String sqlAddConditions(StringBuilder sqlBuild, List<DatasourceConditionsEntity> conditions) {
        sqlBuild.append(StringPool.SPACE)
                .append("WHERE").append(StringPool.SPACE);
        if (CollectionUtil.isNotEmpty(conditions)) {
            for (DatasourceConditionsEntity condition : conditions) {
                if (Objects.isNull(condition.getInputFlag()) ||
                        condition.getInputFlag() != 1) {
                    sqlBuild.append(condition.getConditionCode())
                            .append(StringPool.EQUALS)
                            .append(condition.getInputValue())
                            .append(StringPool.SPACE)
                            .append("AND")
                            .append(StringPool.SPACE);
                } else {
                    sqlBuild.append(condition.getConditionCode())
                            .append(StringPool.EQUALS)
                            .append(StringPool.QUESTION_MARK)
                            .append(StringPool.SPACE)
                            .append("AND")
                            .append(StringPool.SPACE);
                }
            }
        }
        return sqlBuild.append(1)
                .append(StringPool.EQUALS)
                .append(1)
                .append(StringPool.SPACE).toString();
    }
}


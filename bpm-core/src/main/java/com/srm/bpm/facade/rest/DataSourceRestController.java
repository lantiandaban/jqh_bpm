

package com.srm.bpm.facade.rest;

import com.google.common.base.MoreObjects;
import com.google.common.base.Strings;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.bpm.logic.constant.ProcessCode;
import com.srm.bpm.logic.constant.StringPool;
import com.srm.bpm.logic.dto.DataSourceFormDTO;
import com.srm.bpm.logic.dto.DataTablesInputDTO;
import com.srm.bpm.logic.dto.DataTablesOutputDTO;
import com.srm.bpm.logic.dto.DatasourceComboDTO;
import com.srm.bpm.logic.dto.DatasourceConditionDTO;
import com.srm.bpm.facde.dto.DatasourceDTO;
import com.srm.bpm.logic.dto.DatasourcePopoverDTO;
import com.srm.bpm.logic.dto.ZZTableField;
import com.srm.bpm.logic.service.DataSourceLogic;
import com.srm.bpm.logic.service.LoginUserHolder;
import com.srm.bpm.logic.vo.DatasourceVO;
import com.srm.common.data.exception.RbException;
import com.srm.common.data.rest.R;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.validation.Valid;

import cn.hutool.core.lang.Pair;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import springfox.documentation.annotations.ApiIgnore;

import static com.srm.bpm.logic.constant.DatasourceConst.MASK_WHERE_SQL;
import static com.srm.bpm.logic.constant.StringPool.ZERO;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@RestController
@RequestMapping("/datasource/rest")
@RequiredArgsConstructor
@Api(tags = "数据源")
public class DataSourceRestController {
    private final DataSourceLogic dataSourceLogic;
    private final LoginUserHolder loginUserHolder;

    /**
     * 通过数据源id获取 下拉框信息
     *
     * @param id 数据源id
     */
    @ApiOperation(value = "数据源id获取下拉框信息", httpMethod = "GET")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "据源id", required = true, paramType = "path", dataType = "Long")
    })
    @GetMapping("/combo/{id}")
    public R<DatasourceComboDTO> getCombo(@ApiIgnore @PathVariable(value = "id", required = false) long id) {
        if (id <= 0) {
            return R.empty();
        }
        final DatasourceComboDTO datasourceCombo = dataSourceLogic.getComboByDatasourceId(id);
        return R.ok(datasourceCombo);
    }

    /**
     * 通过数据源id获取 条件值
     *
     * @param id 数据源id
     */
    @ApiOperation(value = "通过数据源id获取条件值", httpMethod = "GET")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "据源id", required = true, paramType = "path", dataType = "Long")
    })
    @GetMapping("/condition/{id}")
    public R<List<DatasourceConditionDTO>> getCondition(@ApiIgnore @PathVariable(value = "id", required = false) long id) {
        if (id <= 0) {

            return R.empty();
        }
        final List<DatasourceConditionDTO> datasourceConditionss = dataSourceLogic.getConditionByDataSourceId(id);
        return R.ok(datasourceConditionss);
    }

    /**
     * 通过数据源id获取 弹出框信息
     *
     * @param id 数据源id
     */
    @ApiOperation(value = "通过数据源id获取弹出框信息", httpMethod = "GET")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "据源id", required = true, paramType = "path", dataType = "Long")
    })
    @GetMapping("/popover/{id}")
    public R<DatasourcePopoverDTO> get(@ApiIgnore @PathVariable(value = "id", required = false) long id) {
        if (id <= 0) {
            R.empty();
        }

        final DatasourcePopoverDTO datasourcePopover = dataSourceLogic.getPopoverByDataSourceId(id);
        return R.ok(datasourcePopover);
    }

    /**
     * 获取sql查询列
     */
    @ApiOperation(value = "获取sql查询列")
    @PostMapping("/sqlfields")
    public R<List<ZZTableField>> sqlfields(
            @RequestBody Map<String, Object> data
    ) {
        String sqlscript = (String) data.get("sqlscript");
        Long dataSourceId = 0L;
        if (!Objects.isNull(data.get("id"))) {
            dataSourceId = Long.valueOf(data.get("id").toString());
        }
        if (Strings.isNullOrEmpty(sqlscript)) {
            return R.empty();
        }
        try {
            sqlscript = sqlscript.replace(MASK_WHERE_SQL,"");
            dataSourceLogic.executeSql(sqlscript, StringPool.EMPTY, null);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(ProcessCode.DELETE_DS_ERROR, "数据库执行错误,请检查sql脚本");
        }
        final List<ZZTableField> tableFields;
        tableFields = dataSourceLogic.getSqlSelectColumns(sqlscript, dataSourceId);
        return R.ok(tableFields);
    }


    /**
     * 获取某个表的字段信息以及对应设置的信息
     *
     * @param tableName 数据库表名
     * @return 信息
     */
    @GetMapping("/table/filed")
    @ApiOperation(value = "获取某个表的字段信息", httpMethod = "GET")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "table_name", value = "表名", required = true, paramType = "query", dataType = "String"),
            @ApiImplicitParam(name = "id", value = "据源id", required = true, paramType = "query", dataType = "Long"),
    })
    public R<List<ZZTableField>> fields(
            @RequestParam(value = "table_name") String tableName,
            @RequestParam(value = "id", required = false, defaultValue = ZERO) long dataSourceId
    ) {
        final List<ZZTableField> tableFields = dataSourceLogic.ganerateTableFields(tableName, dataSourceId);
        return R.ok(tableFields);
    }


    @ApiOperation(value = "分页查询数据源", httpMethod = "GET")
    @ApiImplicitParams(
            {
                    @ApiImplicitParam(name = "page", defaultValue = "1"),
                    @ApiImplicitParam(name = "limit", defaultValue = "10")
            })
    @GetMapping("/list")
    public R<List<DatasourceDTO>> grid(
            @ApiIgnore @RequestParam Map<String, Object> params
    ) {
        final Integer pageNo = Integer.valueOf((String) params.get("page"));
        final Integer pageSize = Integer.valueOf((String) params.get("limit"));
        Pair<List<DatasourceDTO>, Long> pair = dataSourceLogic.getDatasourceByPage(pageNo, pageSize);
        return R.ok(pair.getKey(), pair.getValue());
    }

    /**
     * 保存数据源
     *
     * @param dataSourceFormDTO 数据源输入参数
     * @return 响应信息
     */
    @ApiOperation(value = "保存数据源", httpMethod = "POST")
    @PostMapping("/save")
    public R save(@Valid @RequestBody DataSourceFormDTO dataSourceFormDTO) {

        final String userCode = loginUserHolder.getUserCode();
        try {
            boolean isOk = this.dataSourceLogic.saveDataSource(dataSourceFormDTO, userCode);
            return R.state(isOk);
        } catch (RbException e) {
            e.printStackTrace();
            return R.error(ProcessCode.DS_SAVE_ERROR, "数据源保存错误");
        }
    }

    @ApiOperation(value = "获取数据详情", httpMethod = "GET")
    @ApiImplicitParam(name = "id", value = "id", required = true, paramType = "path", dataType = "String")
    @GetMapping("/{id}")
    public R<DataSourceFormDTO> detail(@ApiIgnore @PathVariable Long id) {
        if (id > 0) {
            DataSourceFormDTO dataSourceFormDTO = this.dataSourceLogic.getDetailById(id);
            return R.ok(dataSourceFormDTO);
        } else {
            return R.empty();
        }
    }

    /**
     * 批量删除数据源
     *
     * @param ids 数据源ID数组
     * @return 响应结果
     */
    @ApiOperation(value = "删除数据源")
    @ApiImplicitParam(name = "ids", value = "多个id逗号隔开", required = true, paramType = "path", dataType = "String")
    @DeleteMapping("/delete/{ids}")
    public R delete(@PathVariable String ids) {
        final List<String> list = Arrays.asList(ids.split(","));
        return R.state(dataSourceLogic.batchDeleteDatasource(list));
    }

    /**
     * 获取平台数据库列表
     *
     * @return 数据库列表
     */
    @ApiOperation(value = "获取平台表名", httpMethod = "GET")
    @GetMapping("/tables")
    public R getTables() {
        List<String> tables = dataSourceLogic.mysqlQueryTables();
        return R.ok(tables);
    }

    /**
     * 数据源下拉选择接口
     *
     * @return 数据源信息
     */
    @PostMapping("/triggerselect")
    public DataTablesOutputDTO<Map<String, Object>> triggerselect(
            @RequestBody DataTablesInputDTO dataTablesInput
    ) {

        final JSONObject params = dataTablesInput.getParams();
        if (params == null) {
            throw new RbException(ProcessCode.CODE_EMPTY);
        }
        if (dataTablesInput.getLength() == -1) {
            dataTablesInput.setStart(0);
            dataTablesInput.setLength(Integer.MAX_VALUE);
        }
        final int start = MoreObjects.firstNonNull(dataTablesInput.getStart(), 0);
        int current = start / dataTablesInput.getLength();

        final Page<Map<String, Object>> requestPage = new Page<>(
                current,
                dataTablesInput.getLength()
        );

        String table = params.getString("table");
        Map<String, Object> queryMap;
        try {
            queryMap = (Map<String, Object>) params.get("query");
        } catch (Exception e) {
            throw new RbException(StringPool.EMPTY, ProcessCode.QUERY_JSON_ERROR);
        }
        this.dataSourceLogic.execWithSelect(table, queryMap, requestPage, loginUserHolder.getUserCode());
        DataTablesOutputDTO<Map<String, Object>> dataTablesOutput = new DataTablesOutputDTO<>();
        dataTablesOutput.setData(requestPage.getRecords());
        dataTablesOutput.setDraw(dataTablesInput.getDraw());
        dataTablesOutput.setRecordsTotal(requestPage.getTotal());
        dataTablesOutput.setRecordsFiltered(requestPage.getTotal());
        return dataTablesOutput;
    }
    @GetMapping("/datasources")
    public R<List<DatasourceVO>> datasource(){
        final List<DatasourceVO> datasourceVOList = dataSourceLogic.getAllWithForm();
        return R.ok(datasourceVOList);
    }
}

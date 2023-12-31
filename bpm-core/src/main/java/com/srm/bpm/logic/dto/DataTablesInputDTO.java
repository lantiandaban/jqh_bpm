

package com.srm.bpm.logic.dto;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import com.alibaba.fastjson.JSONObject;

import org.hibernate.validator.constraints.NotEmpty;

import java.util.List;
import java.util.Map;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data

public class DataTablesInputDTO {

    /**
     * Draw counter. This is used by DataTables to ensure that the Ajax returns from server-side
     * processing requests are drawn in sequence by DataTables (Ajax requests are asynchronous and
     * thus can return out of sequence). This is used as part of the draw return parameter (see
     * below).
     */
    @NotNull
    @Min(0)
    private Integer draw = 1;

    /**
     * Paging first record indicator. This is the start point in the current data set (0 index based
     * - i.e. 0 is the first record).
     */
    @NotNull
    @Min(0)
    private Integer start = 0;

    /**
     * Number of records that the table can display in the current draw. It is expected that the
     * number of records returned will be equal to this number, unless the server has fewer records
     * to return. Note that this can be -1 to indicate that all records should be returned (although
     * that negates any benefits of server-side processing!)
     */
    @NotNull
    @Min(-1)
    private Integer length = 10;

    /**
     * Global search parameter.
     */
    @NotNull
    private SearchDTO search = new SearchDTO();

    /**
     * Order parameter
     */
    @NotEmpty
    private List<OrderDTO> order = Lists.newArrayList();

    /**
     * Per-column search parameter
     */
    @NotEmpty
    private List<ColumnDTO> columns = Lists.newArrayList();


    /**
     * 查询参数
     */
    private JSONObject params;

    /**
     * @return a {@link Map} of {@link ColumnDTO} indexed by name
     */
    public Map<String, ColumnDTO> getColumnsAsMap() {
        Map<String, ColumnDTO> map = Maps.newHashMap();
        for (ColumnDTO column : columns) {
            map.put(column.getData(), column);
        }
        return map;
    }

    /**
     * Find a column by its name
     *
     * @param columnName the name of the column
     * @return the given Column, or <code>null</code> if not found
     */
    public ColumnDTO getColumn(String columnName) {
        if (columnName == null) {
            return null;
        }
        for (ColumnDTO column : columns) {
            if (columnName.equals(column.getData())) {
                return column;
            }
        }
        return null;
    }

    /**
     * Add a new column
     *
     * @param columnName  the name of the column
     * @param searchable  whether the column is searchable or not
     * @param orderable   whether the column is orderable or not
     * @param searchValue if any, the search value to apply
     */
    public void addColumn(String columnName, boolean searchable, boolean orderable,
                          String searchValue) {
        this.columns.add(new ColumnDTO(columnName, "", searchable, orderable,
                new SearchDTO(searchValue, false)));
    }

    /**
     * Add an order on the given column
     *
     * @param columnName the name of the column
     * @param ascending  whether the sorting is ascending or descending
     */
    public void addOrder(String columnName, boolean ascending) {
        if (columnName == null) {
            return;
        }
        for (int i = 0; i < columns.size(); i++) {
            if (!columnName.equals(columns.get(i).getData())) {
                continue;
            }
            order.add(new OrderDTO(i, ascending ? "asc" : "desc"));
        }
    }

    /**
     * 判断是否存在查询参数
     *
     * @return true 表示有查询参数，否则没有
     */
    public boolean hasParasm() {
        return params != null && !params.isEmpty();
    }
}

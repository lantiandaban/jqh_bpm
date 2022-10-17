

package com.srm.bpm.logic.vo;


import java.io.Serializable;
import java.util.List;

import lombok.Data;
import com.srm.bpm.logic.dto.DatasourcePagingDto;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class DatasourcePopoverVO implements Serializable {


    private static final long serialVersionUID = 6386082212449300246L;
    /**
     * 数据源分页
     */
    private DatasourcePagingDto paging;
    /**
     * 搜索字段
     */
    private List<DatasourceFieldVO> searchItems;
    /**
     * 显示表格字段
     */
    private List<DatasourceFieldVO> tableColumns;
}

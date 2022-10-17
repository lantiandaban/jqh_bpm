

package com.srm.bpm.logic.vo;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * <p> 数据源配置 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class DatasourceVO implements Serializable {

    private static final long serialVersionUID = -842811304148748048L;
    /**
     * 名称
     */
    private String name;
    /**
     * 数据源编码
     */
    private String table;

    /**
     * 数据源字段
     */
    private List<DatasourceFieldVO> fields;

    private DatasourceComboPropVO combo;
    private DatasourcePopoverVO popover;
}

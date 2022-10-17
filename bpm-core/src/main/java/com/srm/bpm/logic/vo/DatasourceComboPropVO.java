

package com.srm.bpm.logic.vo;

import java.io.Serializable;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class DatasourceComboPropVO implements Serializable {
    private static final long serialVersionUID = 5267795704516313857L;


    /**
     * 显示字段
     */
    private DatasourceFieldVO displayField;
    /**
     * 值字段
     */
    private DatasourceFieldVO valueField;
    /**
     * 延迟搜索输入
     */
    private boolean lazy;
}

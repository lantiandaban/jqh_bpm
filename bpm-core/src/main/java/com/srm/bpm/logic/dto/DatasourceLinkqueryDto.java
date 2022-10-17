 

package com.srm.bpm.logic.dto;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author Administrator
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class DatasourceLinkqueryDto {
    private String field;
    private String fieldValue;
    private String table;
    private String equalField;
    private String xtype;
    private String correspondField;
}

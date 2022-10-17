 

package com.srm.bpm.infra.po;

import java.io.Serializable;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
public class TableFieldPO implements Serializable {
    private String columnComment;
    private String dataType;
    private String columnName;
}

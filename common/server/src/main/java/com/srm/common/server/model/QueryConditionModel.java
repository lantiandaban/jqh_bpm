 

package com.srm.common.server.model;

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
public class QueryConditionModel implements Serializable {
    private static final long serialVersionUID = 1063755293896031189L;
    private String field;
    private String type;
    private String rule;
    private String val;
}

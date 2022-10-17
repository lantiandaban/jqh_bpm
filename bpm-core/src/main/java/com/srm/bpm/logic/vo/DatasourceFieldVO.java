 

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
public class DatasourceFieldVO implements Serializable {

    private static final long serialVersionUID = -5666299729449291716L;
    private String name;
    private String field;
    private String fieldAs;
    private String vtype;
}



package com.srm.bpmserver.infra.po;

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
public class PositionUserPO implements Serializable {
    private static final long serialVersionUID = 7502943057079629867L;
    private String id;
    private String name;
    private String pid;
}

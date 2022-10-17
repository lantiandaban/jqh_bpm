

package com.srm.bpm.facde.dto;

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
public class BillTaskDTO implements Serializable {
    private static final long serialVersionUID = -1531474624480564826L;
    private Long id;
    private String nodeName;
    private Integer selectApproval;
}

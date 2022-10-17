

package com.srm.bpm.logic.dto;

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
    private static final long serialVersionUID = -7317156193300518589L;
    private Long id;
    private String nodeName;
    private Integer selectApproval;
}

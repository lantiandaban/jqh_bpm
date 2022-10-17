

package com.srm.bpm.logic.vo;

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
public class BillTaskVO implements Serializable {
    private static final long serialVersionUID = 2745371112076597542L;
    private Long id;
    private String nodeName;
    private Integer selectApproval;
}

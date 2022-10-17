

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
public class ProcessDTO implements Serializable {
    private static final long serialVersionUID = -8861384418515695246L;
    private String code;
    private long id;
    private String name;
    private Long iconId;
    private String formLink;
    private String approveLink;
    private Integer manualStartFlag;
}



package com.srm.bpm.facde.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
public class ProcessTypeDTO implements Serializable {
    private long id;
    private String name;
    private String code;
    private List<ProcessDTO> flows;
}



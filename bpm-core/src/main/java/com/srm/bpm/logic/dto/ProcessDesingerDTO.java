 

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
public class ProcessDesingerDTO implements Serializable {
    private Long id;

    private Long processId;

    private String desingerJson;

    private String processXml;

    private String settingJson;
}



package com.srm.bpm.logic.vo;


import java.io.Serializable;

import lombok.Data;
import com.srm.bpm.facde.dto.ProcessGridDTO;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class ProcessListVO implements Serializable {


    private static final long serialVersionUID = 1174399743852662131L;
    private String code;
    private long id;
    private String name;
    private long typeId;
    private String typeName;

    public static ProcessListVO build(ProcessGridDTO processGridDTO) {
        ProcessListVO processListVO = new ProcessListVO();
        processListVO.setCode(processGridDTO.getCode());
        processListVO.setName(processGridDTO.getDisplayName());
        processListVO.setId(processGridDTO.getId());
        processListVO.setTypeId(processGridDTO.getTypeId());
        processListVO.setTypeName(processGridDTO.getTypeName());
        return processListVO;
    }
}

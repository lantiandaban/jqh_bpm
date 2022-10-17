

package com.srm.bpm.infra.service;

import com.srm.bpm.logic.dto.FormThirdDTO;
import com.srm.bpm.logic.dto.FormThirdItemDTO;

import java.util.List;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface FormThirdItemLogic {
    String analysisToForm(String data,Long processId);

    List<FormThirdItemDTO> findByProcessId(Long processId);

    void save(FormThirdDTO formThirdDTO);
}

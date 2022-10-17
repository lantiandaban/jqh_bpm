

package com.srm.bpm.logic.service;

import com.srm.bpm.logic.dto.FormDesingerDTO;
import com.srm.bpm.logic.dto.ProcessDesingerDTO;
import com.srm.bpm.logic.dto.ProcessDetailDTO;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface ProcessDesingerLogic {
    ProcessDetailDTO getByProecessId(long processId);

    FormDesingerDTO getDesingerJSON(long processId);

    ProcessDesingerDTO getDesingerById(long processId);

    /**
     * 流程设计器保存接口，发布流程，设置节点等
     *
     * @param processDesingerData 流程表单JSON
     * @param processId             流程id信息
     */
    void saveProcessAndSetting(String processDesingerData, long processId);
}

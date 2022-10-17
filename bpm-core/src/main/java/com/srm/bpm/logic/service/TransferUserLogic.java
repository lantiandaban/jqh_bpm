

package com.srm.bpm.logic.service;

import com.srm.bpm.logic.dto.TransferUserDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface TransferUserLogic {
    /**
     * 根据用户和日期查询当前用户哪些有转办的数据
     * @param userCode 用户编号集合
     * @param billId 审批单id
     * @param time 时间
     * @return 判断用户和日期
     */
    List<TransferUserDTO> getByProcess(Set<String> userCode, long billId, LocalDateTime time);
}

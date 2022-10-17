

package com.srm.bpmserver.logic.impl;

import com.google.common.collect.Lists;

import com.srm.bpm.logic.dto.TransferUserDTO;
import com.srm.bpm.logic.service.TransferUserLogic;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@RequiredArgsConstructor
@Service
@Slf4j
public class TransferUserLogicImpl implements TransferUserLogic {
    /**
     * 根据用户和日期查询当前用户哪些有转办的数据
     *
     * @param userCode 用户编号集合
     * @param billId   审批单id
     * @param time     时间
     * @return 判断用户和日期
     */
    @Override
    public List<TransferUserDTO> getByProcess(Set<String> userCode, long billId, LocalDateTime time) {
        List<TransferUserDTO> result = Lists.newArrayList();
//        TransferUserDTO transferUserDTO = new TransferUserDTO();
//        transferUserDTO.setUserCode("1");
//        transferUserDTO.setTargetUserCode("50549");
//        transferUserDTO.setId("1");
//        result.add(transferUserDTO);
        return result;
    }
}

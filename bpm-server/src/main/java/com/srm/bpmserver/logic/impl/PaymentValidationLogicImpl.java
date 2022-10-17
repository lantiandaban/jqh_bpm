

package com.srm.bpmserver.logic.impl;

import com.srm.bpm.logic.context.BillDataContext;
import com.srm.bpm.logic.dto.ValidationResultDTO;
import com.srm.bpm.logic.service.BillValidationLogic;

import org.springframework.stereotype.Service;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Service(value = "paymentValidationLogicImpl")
public class PaymentValidationLogicImpl implements BillValidationLogic {
    @Override
    public ValidationResultDTO validation(BillDataContext billDataContext, String s) {
        ValidationResultDTO validationResultDTO = new ValidationResultDTO();
        validationResultDTO.setPassedFlag(false);
        validationResultDTO.setAllowGoOnFlag(false);
        validationResultDTO.setTipMessage("发生错误了!");
        return validationResultDTO;
    }
}

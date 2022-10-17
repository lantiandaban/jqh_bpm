

package com.srm.bpm.logic.dto;

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
public class ValidationResultDTO implements Serializable {
    private Boolean passedFlag;
    private Boolean allowGoOnFlag;
    private List<Long> relationBillIds;
    private String tipMessage;
    private Long validationId;

    public static ValidationResultDTO noConfig() {
        ValidationResultDTO validationResultDto = new ValidationResultDTO();
        validationResultDto.setAllowGoOnFlag(true);
        validationResultDto.setPassedFlag(true);
        return validationResultDto;
    }
}

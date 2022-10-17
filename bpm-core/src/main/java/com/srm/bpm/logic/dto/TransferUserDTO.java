

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
public class TransferUserDTO implements Serializable {
    private static final long serialVersionUID = 6230643310500151556L;
    private String id;
    private String userCode;
    private String targetUserCode;
}

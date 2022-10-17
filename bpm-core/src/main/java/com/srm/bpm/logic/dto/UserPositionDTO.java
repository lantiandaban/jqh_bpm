

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
public class UserPositionDTO implements Serializable {
    private static final long serialVersionUID = 2479467961923037263L;
    /**
     * 用户id
     */
    private Long userId;
    /**
     * 职位编号
     */
    private String positionCode;
    /**
     *职位名称
     */
    private String positionName;
    /**
     * 职位部门id
     */
    private Long orgId;
    /**
     * 职位id
     */
    private Long positionId;
}

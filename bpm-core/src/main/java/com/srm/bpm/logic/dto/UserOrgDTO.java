

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
public class UserOrgDTO implements Serializable {
    private static final long serialVersionUID = 480422833463040279L;
    /**
     * 用户id
     */
    private String userId;
    /**
     * 部门名称
     */
    private String orgName;

    /**
     * 部门编号
     */
    private String orgCode;
    /**
     * 部门id
     */
    private Long orgId;
}

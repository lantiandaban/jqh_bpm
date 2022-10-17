

package com.srm.common.data.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

/**
 * 登录用户信息
 *
 * @author fitz.yang
 * @version 2021.02
 * @since scis 2021.02
 */
@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class UserInfo {
    /**
     * 用户编码
     */

    private String code;

    /**
     * 用户名称
     */
    private String username;

    /**
     * 用户昵称
     */
    private String nickName;

    /**
     * 登录密码
     */
    private String password;

    private Integer status;

    private List<String> roles;

    /**
     * 平台编码
     */
    private String bloc;

    private Set<String> orgCodes;

    /**
     * 所有部门包括子部门
     */
    private Set<String> subOrgCodes;

    /**
     * 用户的主岗位
     */
    private Set<String> mainPosition;
    /**
     * 用户的兼职岗位
     */
    private Set<String> partTimePosition;

    private Set<String> projectCodes;

}
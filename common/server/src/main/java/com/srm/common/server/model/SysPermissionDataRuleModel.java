 

package com.srm.common.server.model;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
public class SysPermissionDataRuleModel {

    private String code;
    /**
     * 字段
     */
    private String ruleColumn;

    /**
     * 条件
     */
    private Integer ruleConditions;

    /**
     * 规则值
     */
    private String ruleValue;
}

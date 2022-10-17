 

package com.srm.bpm.logic.constant;

/**
 * <p> 审批人类型 1-组织机构;2-项目字段;3-客户字段;
 *
 * 抄送人类型 1-指定人员；2-申请人直属上级;3-审批人直属上级</p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
public interface SubjectType {

    int APPROVER_ORG = 1;

    int APPROVER_PROJECT = 2;

    int APPROVER_CUSTOMER = 3;
    /**
     * 审批人是表单中的某个字段值
     */
    int FORM_FIELD = 5;


    int CC_EMPLOYEE = APPROVER_ORG;
    int CC_ORG_LEADER = APPROVER_PROJECT;
    int CC_APPROVER_LEADER = APPROVER_CUSTOMER;
}

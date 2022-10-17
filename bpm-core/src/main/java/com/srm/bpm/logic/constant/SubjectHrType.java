

package com.srm.bpm.logic.constant;

/**
 * <p> 人力资源类型 1-指定人员;2-申请人部门;3-指定职位;4-申请人直属上级</p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
public interface SubjectHrType {

    /**
     * 指定人员
     */
    int EMPLOYEE = 1;
    /**
     * 申请人部门
     */
    int ORGANIZATION = 2;
    /**
     * 指定职位
     */
    int POSITION = 3;
    /**
     * 申请人直属上级
     */
    int LEADER = 4;
    /**
     * 申请人上级部门
     */
    int LEVEL_POSITION = 5;
}

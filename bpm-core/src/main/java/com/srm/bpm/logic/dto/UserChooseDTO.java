

package com.srm.bpm.logic.dto;

import lombok.Data;

/**
 * <p>员工选择数据传输对象</p>
 *
 * @author GeorgeChan
 * @version 1.0
 * @since jdk 1.8
 */
@Data
public class UserChooseDTO {
    /**
     * 员工id
     */
    private long id;
    /**
     * 员工姓名
     */
    private String username;

    /**
     * 员工的职位
     */
    private String position;

    /**
     * 部门的名称
     */
    private String orgName;
}

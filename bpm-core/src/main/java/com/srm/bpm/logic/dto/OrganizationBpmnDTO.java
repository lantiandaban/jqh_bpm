

package com.srm.bpm.logic.dto;

import java.io.Serializable;

import lombok.Data;

/**
 * <p> 部门信息 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class OrganizationBpmnDTO implements Serializable {


    private static final long serialVersionUID = -348789276941956742L;
    /**
     * 组织机构ID
     */
    private long id;

    /**
     * 组织机构编码
     */
    private String code;

    /**
     * 组织机构名称
     */
    private String name;
}

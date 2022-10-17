

package com.srm.bpm.logic.dto;

import java.io.Serializable;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class PositionBpmnDTO implements Serializable{


    private static final long serialVersionUID = -348789276941956742L;
    /**
     * 职位ID
     */
    private long id;

    /**
     * 职位编码
     */
    private String code;

    /**
     * 职位名称
     */
    private String name;
}

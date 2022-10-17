

package com.srm.bpmserver.infra.po;

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
public class PositionPO implements Serializable {
    private static final long serialVersionUID = -3905288100782392630L;
    /**
     * 物理主键
     */
    private String id;
    /**
     * 职位名称
     */
    private String name;
    /**
     * 上级id
     */
    private String pid;
}

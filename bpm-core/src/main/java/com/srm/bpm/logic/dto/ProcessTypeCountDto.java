

package com.srm.bpm.logic.dto;

import java.io.Serializable;

import lombok.Data;

/**
 * <p> 业务流程类型业务流程数量统计DTO</p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class ProcessTypeCountDto implements Serializable {
    private static final long serialVersionUID = -390122683509589506L;

    public String name;

    private long id;

    private int count;
}

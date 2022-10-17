

package com.srm.common.server.log;

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
public abstract class BaseLog implements Serializable {
    private static final long serialVersionUID = -3743966119945589567L;
    /**
     * 日志类型
     */
    private Integer type;
}

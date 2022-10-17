 

package com.srm.bpm.logic.vo;

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
public class TreeDataVO implements Serializable {

    private static final long serialVersionUID = 5788202128772479522L;
    /**
     * ID
     */
    private long id;
    /**
     * 编码
     */
    private String code;
    /**
     * 名称
     */
    private String name;
    /**
     * 上级ID
     */
    private long parentId;
}

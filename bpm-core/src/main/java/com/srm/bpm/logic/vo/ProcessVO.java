

package com.srm.bpm.logic.vo;


import java.io.Serializable;

import lombok.Data;

/**
 * <p> 流程节点设置 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class ProcessVO implements Serializable {

    private static final long serialVersionUID = -3541777995641066523L;
    private String code;
    private long id;
    private String name;
    private long typeId;
    private Long iconId;
    private String formLink;
    private String approveLink;
    private Integer manualStartFlag;
    private Integer size;
}

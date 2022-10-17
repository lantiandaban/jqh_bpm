

package com.srm.bpm.infra.po;

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
public class ProcessGridPO implements Serializable {
    private static final long serialVersionUID = -1039756378697368970L;
    private long id;
    private String name;
    private String code;
    private String displayName;
    private long typeId;
    private String typeName;
    private int sort;
    private Long createTime;
    private String flowId;
    private int status;
    private Long iconId;
    private String url;
    private String formLink;
    private String approveLink;
    private Integer manualStartFlag;
}

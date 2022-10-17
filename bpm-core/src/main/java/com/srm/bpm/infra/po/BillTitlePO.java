

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
public class BillTitlePO implements Serializable {
    private static final long serialVersionUID = -5940684624909713787L;
    /**
     * 业务流程主键
     */
    private Long processId;
    /**
     * 标题表达式
     */
    private String formula;
    /**
     * 时间
     */
    private boolean timeFlag;
    /**
     * 时间格式
     */
    private String timePattern;
    /**
     * 流程名称
     */
    private boolean processTitle;
    /**
     * 流程类型名称
     */
    private boolean processType;

    /**
     * 创建人标记
     */
    private boolean createrFlag;


    private String processName;

    private String processTypeName;
}

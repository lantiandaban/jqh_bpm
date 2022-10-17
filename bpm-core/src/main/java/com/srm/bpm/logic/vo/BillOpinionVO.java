 

package com.srm.bpm.logic.vo;

import java.io.Serializable;

import lombok.Data;

/**
 * <p>意见列表 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class BillOpinionVO implements Serializable {
    private static final long serialVersionUID = 5111270672209116130L;

    /**
     * 意见ID
     */
    private Long id;
    /**
     * 意见标题
     */
    private String title;
    /**
     * 意见内容
     */
    private String content;
    /**
     * 意见时间
     */
    private Integer dateline;

    /**
     * 审批状态
     *
     * @see com.jtech.toa.bill.constants.BillTaskStatus
     */
    private Integer status;
}

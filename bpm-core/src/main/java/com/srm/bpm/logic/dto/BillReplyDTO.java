 

package com.srm.bpm.logic.dto;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author hlzhou
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class BillReplyDTO {
    private long id;
    private String userCode;
    private String avatar;
    private String userName;
    private String content;
    private int dateline;

    /**
     * 审批单的回复数量
     */
    private int replies;
    /**
     * 是否是当前登录人发起的回复，如果是才允许删除
     */
    private boolean self;
}

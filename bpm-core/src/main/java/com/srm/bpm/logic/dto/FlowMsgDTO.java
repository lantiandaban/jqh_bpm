

package com.srm.bpm.logic.dto;

import java.time.LocalDateTime;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
public class FlowMsgDTO {
    /**
     * 审批单标题
     */
    private String billTitle;
    /**
     * 审批单创建用户标识
     */
    private String createUser;
    /**
     * 接收人标记
     */
    private String userCode;
    /**
     * 审批文字，如：审批中，已同意。。。
     */
    private String content;
    /**
     * 节点名称
     */
    private String nodeName;
    /**
     * 审批意见
     */
    private String opinion;
    /**
     * 时间
     */
    private LocalDateTime time;

    public static FlowMsgDTO build(String userCode, String createUser, String content, String title, String nodeName, String opinion) {
        FlowMsgDTO flowMsgDTO = new FlowMsgDTO();
        flowMsgDTO.setCreateUser(createUser);
        flowMsgDTO.setUserCode(userCode);
        flowMsgDTO.setContent(content);
        flowMsgDTO.setBillTitle(title);
        flowMsgDTO.setNodeName(nodeName);
        flowMsgDTO.setOpinion(opinion);
        flowMsgDTO.setTime(LocalDateTime.now());
        return flowMsgDTO;
    }
}

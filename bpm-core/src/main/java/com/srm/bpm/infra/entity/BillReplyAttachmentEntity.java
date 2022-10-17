 

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 审批意见附件
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("bill_reply_attachment")
public class BillReplyAttachmentEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 回复主键
     */
    private Long replyId;

    /**
     * 图片标记
     */
    private Integer imageFlag;

    private String url;

    /**
     * 附件主键
     */
    private Long attachmentId;


}

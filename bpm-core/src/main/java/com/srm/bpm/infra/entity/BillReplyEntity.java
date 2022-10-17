 

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 审批单-回复
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("bill_reply")
public class BillReplyEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 审批单主键
     */
    private Long billId;

    /**
     * 回复用户
     */
    private String userCode;

    private String content;

    /**
     * 审批用户主键
     */
    private String approverId;

    private String signatureBase64;

    private String signature;

    /**
     * 回复时间
     */
    private Integer dateline;


}

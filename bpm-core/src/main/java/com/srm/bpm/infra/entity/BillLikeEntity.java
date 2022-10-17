

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 审批单-赞
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("bill_like")
public class BillLikeEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 审批单主键
     */
    private Long billId;

    /**
     * 赞时间
     */
    private Integer dateline;

    /**
     * 赞用户
     */
    private String userCode;

    private String userName;


}

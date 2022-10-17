

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;
import lombok.EqualsAndHashCode;
import com.srm.common.base.infra.entity.BaseEntity;

/**
 * <p>
 * 审批单阅读表
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("bill_read_record")
public class BillReadRecordEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 审批单主键
     */
    private Long billId;

    /**
     * 读取时间
     */
    private Integer readTime;

    /**
     * 读取用户编码
     */
    private String userCode;


}

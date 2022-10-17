

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 审批业务数据
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("bill_biz_data")
public class BillBizDataEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 审批主键
     */
    private Long billId;

    private String bizValue;

    private String bizType;

    private String bizRecord;


}



package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 审批单抄送人信息
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("bill_cc_person")
public class BillCcPersonEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 审批单主键
     */
    private Long billId;

    /**
     * 用户编号
     */
    private String userCode;

    /**
     * 业务流程主键
     */
    private Long processId;

    private String nodeName;

    /**
     * 审批时间
     */
    private Integer dateline;


}



package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 记账单
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("bill_tally")
public class BillTallyEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 员工主键
     */
    private Long employeeId;

    /**
     * 记账日期
     */
    private Integer dateline;

    /**
     * 记账类别
     */
    private Long type;

    private String icon;

    /**
     * 记账金额
     */
    private Float amount;

    private String remark;

    /**
     * 创建时间
     */
    private Integer createTime;

    /**
     * 创建人
     */
    private Long creater;

    /**
     * 修改人
     */
    private Long updater;

    /**
     * 删除标记;0-未删除;1-已删除
     */
    private Integer deleteFlag;

    /**
     * 费用方式-实施、售前
     */
    private Long model;

    /**
     * 客户主键
     */
    private Long customerId;

    /**
     * 项目主键
     */
    private Long projectId;


}

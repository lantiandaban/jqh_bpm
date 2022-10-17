

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 审批统计数据
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("bill_stat")
public class BillStatEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 用户编码
     */
    private String userCode;

    /**
     * 待我审批数量
     */
    private Integer todoSize;

    /**
     * 我已审批数量
     */
    private Integer completeSize;

    /**
     * 抄送审批数量
     */
    private Integer ccSize;

    /**
     * 草稿箱数量
     */
    private Integer draftsSize;

    /**
     * 我发起的数量
     */
    private Integer mecreateSize;


}

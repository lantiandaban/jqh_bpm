

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 审核表单数据JSON
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("bill_data_json")
public class BillDataJsonEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long billId;

    private String formData;

    private String formSchema;

    private String associated;

    private String outline;


}



package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 
 * </p>
 *
 * @author JT
 * @since 2021-07-15
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("form_third_item")
public class FormThirdItemEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 配置主键
     */
    private Long thirdId;

    /**
     * 第三方
     */
    private String thirdKey;

    /**
     * 表单字段编码
     */
    private String formFiled;

    /**
     * 描述
     */
    private String name;


}

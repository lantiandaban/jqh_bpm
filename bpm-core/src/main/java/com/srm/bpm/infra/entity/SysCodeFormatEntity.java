

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 编号规则表
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_code_format")
public class SysCodeFormatEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private String name;

    private String format;

    private String division;

    private String param1;

    private String param2;

    private String param3;

    private String param4;

    /**
     * 启用标记
     */
    private Integer status;

    /**
     * 设置时间
     */
    private Integer dateline;


}

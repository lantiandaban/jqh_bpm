

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 数据源弹出框属性
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("datasource_popover")
public class DatasourcePopoverEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 数据源主键
     */
    private Long datasourceId;

    private String searchFields;

    private String tableHeadFields;

    /**
     * 分页标记
     */
    private Integer pageFlag;

    /**
     * 每页显示条数
     */
    private Integer pageSize;


}



package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 数据源下拉框属性
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("datasource_combo")
public class DatasourceComboEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 数据源主键
     */
    private Long datasourceId;

    private String displayField;

    private String valueField;

    /**
     * 显示排序
     */
    private Integer sort;


}

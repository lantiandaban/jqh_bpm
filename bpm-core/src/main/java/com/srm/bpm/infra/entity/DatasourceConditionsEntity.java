 

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 数据源条件
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("datasource_conditions")
public class DatasourceConditionsEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 数据源主键
     */
    private Long datasourceId;

    private String conditionName;

    private String conditionCode;

    private String inputValue;

    /**
     * 允许输入
     */
    private Integer inputFlag=0;

    /**
     * 显示排序
     */
    private Integer sort;


}



package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 数据源字段
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("datasource_filed")
public class DatasourceFiledEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 数据源主键
     */
    private Long datasourceId;

    private String filedName;

    private String filedCode;

    private String enName;

    private String filedType;

    /**
     * 字段排序
     */
    private Integer sort;

    private String filedAs;


}

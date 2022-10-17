 

package com.srm.common.base.infra.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.Version;
import com.srm.common.base.infra.entity.typehandler.MillsUnixTimeDataTypeHandler;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * Entity基础父类
 *
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
@Getter
@Setter
@Accessors(chain = true)
public abstract class BaseEntity implements Serializable {
    private static final long serialVersionUID = 7063326936118513230L;

    /**
     * 默认主键字段id，类型为Long型自增，转json时转换为String
     */
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 数据库版本，用于乐观锁
     */
    @Version
    private Integer version;

    /**
     * 创建时间
     */
    @TableField(value = "creation_time", typeHandler = MillsUnixTimeDataTypeHandler.class)
    private LocalDateTime creationTime;

    /**
     * 修改时间
     */
    @TableField(value = "update_time", typeHandler = MillsUnixTimeDataTypeHandler.class)
    private LocalDateTime updateTime;

    /**
     * 删除标记 is_deleted=1 表示已删除
     */
    @TableField(value = "is_deleted", select = false)
    @TableLogic
    private Integer isDeleted;
}

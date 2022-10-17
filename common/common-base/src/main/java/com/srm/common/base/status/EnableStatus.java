

package com.srm.common.base.status;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Objects;

import com.srm.common.data.constant.BaseEnumValue;

/**
 * 启用禁用状态
 *
 * @author fitz.yang
 * @version 2021.02
 * @since triton 2021.02
 */
public enum EnableStatus implements BaseEnumValue {

    /**
     * 禁用
     */
    Disable(0),
    /**
     * 启用
     */
    Enable(1);


    @EnumValue
    private final int value;

    EnableStatus(int val) {
        this.value = val;
    }

    @JsonCreator
    public static EnableStatus forValue(Integer status) {
        if (Objects.isNull(status)) {
            return null;
        }
        for (EnableStatus enableStatus : values()) {
            if (enableStatus.getValue() == status) {
                return enableStatus;
            }
        }
        return Disable;
    }

    @JsonValue
    @Override
    public int getValue() {
        return value;
    }
}

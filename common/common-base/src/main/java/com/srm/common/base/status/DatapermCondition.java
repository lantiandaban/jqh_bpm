 

package com.srm.common.base.status;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Objects;

import com.srm.common.data.constant.BaseEnumValue;

/**
 * 1:全部可见,2:本人可见,3:所有组织可见,4:所有组织和子组织可见,5:自定义
 *
 * @author fitz.yang
 * @version 2021.02
 * @since scis 2021.02
 */
public enum DatapermCondition implements BaseEnumValue {

    DEFAULT(0),
    /**
     * 全部可见
     */
    ALL(1),
    /**
     * 本人可见
     */
    SELF(2),
    /**
     * 所有组织可见
     */
    ALL_ORG(3),
    /**
     * 所有组织和子组织可见
     */
    ALL_ORG_SUB(4),
    /**
     * 自定义
     */
    CUSTOM(5);


    @EnumValue
    private final int val;

    DatapermCondition(int type) {
        this.val = type;
    }

    @JsonCreator
    public static DatapermCondition forValue(Integer type) {
        if (Objects.isNull(type)) {
            return null;
        }
        for (DatapermCondition resourceType : values()) {
            if (resourceType.getValue() == type) {
                return resourceType;
            }
        }
        return null;
    }

    @JsonValue
    @Override
    public int getValue() {
        return val;
    }
}

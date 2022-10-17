

package com.srm.bpm.logic.define.widget;

import com.google.common.collect.Lists;

import java.util.Collections;
import java.util.List;

import cn.hutool.core.util.StrUtil;
import lombok.Data;
import lombok.EqualsAndHashCode;
import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.bpm.logic.define.WidgeSourceType;
import com.srm.bpm.logic.define.widget.props.NumberDecimal;
import com.srm.bpm.logic.define.widget.props.SourceTypeRely;
import com.srm.bpm.logic.define.widget.props.ValueFormula;
import com.srm.bpm.logic.dto.FormTableFieldDto;

/**
 * <p> 数字控件属性 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class NumberWidget extends AbstractWidget {

    /**
     * 值类型
     */
    private WidgeSourceType valueType;
    /**
     * 默认值
     */
    private String value;

    /**
     * 是否开启小计
     */
    private boolean subtotal;

    /**
     * 联动配置
     */
    private SourceTypeRely rely;
    /**
     * 表达式配置
     */
    private ValueFormula formula;
    /**
     * 小数点配置
     */
    private NumberDecimal decimals;

    @Override
    public <T> List<T> items() {
        return Collections.emptyList();
    }

    @Override
    public List<FormTableFieldDto> toTableField() {
        FormTableFieldDto formTableField = new FormTableFieldDto();
        formTableField.setComment(title);
        formTableField.setFieldName(widgetName);
        formTableField.setDefaultValue("0");
        final NumberDecimal decimals = this.getDecimals();
        if (decimals == null || !decimals.isEnabled()) {
            formTableField.setDataType("int(11)");
        } else {
            formTableField.setDataType(StrUtil.format("numeric(20,{})", decimals.getLength()));
        }
        return Lists.newArrayList(formTableField);
    }

    @Override
    public FormFieldEntity toField(long formId, int sort) {
        return toField(formId, sort, 0);
    }

    @Override
    public String title() {
        return this.getTitle();
    }
}

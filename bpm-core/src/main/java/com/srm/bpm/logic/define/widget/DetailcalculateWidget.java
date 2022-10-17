 

package com.srm.bpm.logic.define.widget;

import com.google.common.collect.Lists;

import java.util.Collections;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.bpm.logic.define.WidgeSourceType;
import com.srm.bpm.logic.define.widget.props.ValueFormula;
import com.srm.bpm.logic.dto.FormTableFieldDto;

/**
 * <p> 逻辑计算 属性 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class DetailcalculateWidget extends AbstractWidget {

    /**
     * 开启小计
     */
    private boolean subtotal;

    /**
     * 计算表达式
     */
    private ValueFormula formula;

    /**
     * 值类型
     */
    private WidgeSourceType valueType;

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
        formTableField.setDataType("numeric(28,6)");
        return Lists.newArrayList(formTableField);
    }

    @Override
    public FormFieldEntity toField(long formId, int sort) {
        return toField(formId, sort, 0);
    }

}

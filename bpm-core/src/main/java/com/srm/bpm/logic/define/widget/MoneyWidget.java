

package com.srm.bpm.logic.define.widget;

import com.google.common.collect.Lists;

import java.util.Collections;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.bpm.logic.define.WidgeSourceType;
import com.srm.bpm.logic.define.widget.props.SourceTypeRely;
import com.srm.bpm.logic.define.widget.props.ValueFormula;
import com.srm.bpm.logic.dto.FormTableFieldDto;

/**
 * <p> 金额控件属性 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class MoneyWidget extends AbstractWidget {


    /**
     * 值类型
     */
    private WidgeSourceType valueType;
    /**
     * 默认值
     */
    private String value;

    /**
     *显示大写金额
     */
    private boolean capitalAmount;
    /**
     * 开启小计
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

    @Override
    public <T> List<T>  items() {
        return Collections.emptyList();
    }

    @Override
    public List<FormTableFieldDto> toTableField() {
        FormTableFieldDto formTableField = new FormTableFieldDto();
        formTableField.setComment(title);
        formTableField.setFieldName(widgetName);
        formTableField.setDefaultValue("0");
        formTableField.setDataType("numeric(24,8)");
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

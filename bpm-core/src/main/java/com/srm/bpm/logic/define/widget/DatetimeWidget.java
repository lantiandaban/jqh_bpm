

package com.srm.bpm.logic.define.widget;

import com.google.common.collect.Lists;

import org.apache.commons.lang3.StringUtils;

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
 * <p> 日期控件 属性 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class DatetimeWidget extends AbstractWidget {


    /**
     * 值类型
     */
    private WidgeSourceType valueType;
    /**
     * 值
     */
    private String value;
    /**
     * 日期格式化方式
     */
    private String format;

    /**
     * 是否允许重复值
     */
    private boolean allowRepetitiony;
    /**
     * 联动配置
     */
    private SourceTypeRely rely;
    /**
     * 表达式配置
     */
    private ValueFormula formula;

    @Override
    public<T> List<T>  items() {
        return Collections.emptyList();
    }

    @Override
    public List<FormTableFieldDto> toTableField() {
        FormTableFieldDto formTableField = new FormTableFieldDto();
        formTableField.setComment(title);
        formTableField.setFieldName(widgetName);

        if (StringUtils.equals("yyyy-MM-dd", format)) {
            formTableField.setDataType("date");
        } else {
            formTableField.setDataType("datetime");
        }


        return Lists.newArrayList(formTableField);
    }

    @Override
    public FormFieldEntity toField(long formId, int sort) {
        return toField(formId, sort, 0);
    }

}



package com.srm.bpm.logic.define.widget;

import com.google.common.collect.Lists;

import java.util.Collections;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.bpm.logic.define.WidgeSourceType;
import com.srm.bpm.logic.dto.FormTableFieldDto;

/**
 * <p> 多行文本属性 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class TextareaWidget extends AbstractWidget {


    /**
     * 值类型
     */
    private WidgeSourceType valueType;
    /**
     * 默认值
     */
    private String value;

    @Override
    public <T> List<T>  items() {
        return Collections.emptyList();
    }

    @Override
    public List<FormTableFieldDto> toTableField() {
        FormTableFieldDto formTableField = new FormTableFieldDto();
        formTableField.setComment(title);
        formTableField.setFieldName(widgetName);
        formTableField.setDataType("text");
        return Lists.newArrayList(formTableField);
    }

    @Override
    public FormFieldEntity toField(long formId, int sort) {
        return toField(formId, sort, 0);
    }

}

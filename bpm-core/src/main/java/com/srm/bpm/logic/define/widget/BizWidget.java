

package com.srm.bpm.logic.define.widget;

import com.google.common.collect.Lists;

import java.util.Collections;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.bpm.logic.dto.FormTableFieldDto;

/**
 * <p> 业务字段类型 属性 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class BizWidget extends AbstractWidget {

    /**
     * 业务类型
     */
    private String type;

    /**
     * 是否可以编辑
     */
    private boolean canEdit;


    @Override
    public <T> List<T> items() {
        return Collections.emptyList();
    }

    @Override
    public List<FormTableFieldDto> toTableField() {
        FormTableFieldDto formTableField = new FormTableFieldDto();
        formTableField.setComment(title);
        formTableField.setDefaultValue("''");
        formTableField.setDataType("varchar(255)");
        formTableField.setFieldName(widgetName);
        return Lists.newArrayList(formTableField);
    }

    @Override
    public FormFieldEntity toField(long formId, int sort, long detailFiledId) {
        final FormFieldEntity formField = super.toField(formId, sort, detailFiledId);
        formField.setBizType(type);
        return formField;
    }

    @Override
    public FormFieldEntity toField(long formId, int sort) {
        return toField(formId, sort, 0);
    }

}

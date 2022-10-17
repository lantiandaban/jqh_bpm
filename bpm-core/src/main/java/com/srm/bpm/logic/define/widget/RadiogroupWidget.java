

package com.srm.bpm.logic.define.widget;

import com.google.common.collect.Lists;

import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.bpm.logic.define.WidgeSourceType;
import com.srm.bpm.logic.define.widget.props.SelectOption;
import com.srm.bpm.logic.define.widget.props.SourceTypeRely;
import com.srm.bpm.logic.define.widget.props.ValueFormula;
import com.srm.bpm.logic.dto.FormTableFieldDto;

/**
 * <p> 单选按钮组 属性 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class RadiogroupWidget extends AbstractWidget {

    /**
     * 值类型
     */
    private WidgeSourceType valueType;
    /**
     * 默认值
     */
    private String value;

    /**
     * 允许重复值
     */
    private boolean allowRepetition;
    /**
     * 允许重复值
     */
    private boolean allowRepetitiony;
    /**
     * 联动选项配置
     */
    private SourceTypeRely rely;
    /**
     * 表达式配置
     */
    private ValueFormula formula;

    /**
     * 选项配置
     */
    private List<SelectOption> items;

    @Override
    public <T> List<T> items() {
        return (List<T>) items;
    }

    @Override
    public List<FormTableFieldDto> toTableField() {
        return Lists.newArrayList(createVarcharField(), createTextExtField());
    }

    @Override
    public FormFieldEntity toField(long formId, int sort) {
        return toField(formId, sort, 0);
    }

}

 

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
import com.srm.bpm.logic.define.widget.props.WidgetScan;
import com.srm.bpm.logic.dto.FormTableFieldDto;

/**
 * <p> 单行文本 属性 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class TextWidget extends AbstractWidget {


    /**
     * 值类型
     */
    private WidgeSourceType valueType;
    /**
     * 值
     */
    private String value;
    /**
     * 输入值方式 手机号码等
     */
    private String format;
    /**
     * 扫描配置
     */
    private WidgetScan scan;

    /**
     * 联动配置
     */
    private SourceTypeRely rely;
    /**
     * 表单是
     */
    private ValueFormula formula;

    @Override
    public <T> List<T> items() {
        return Collections.emptyList();
    }

    @Override
    public List<FormTableFieldDto> toTableField() {

        return Lists.newArrayList(createVarcharField());
    }

    @Override
    public FormFieldEntity toField(long formId, int sort) {
        return toField(formId, sort, 0);
    }

}

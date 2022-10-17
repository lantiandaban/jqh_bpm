 

package com.srm.bpm.logic.define.widget;

import com.google.common.collect.Lists;

import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.bpm.logic.define.WidgeSourceType;
import com.srm.bpm.logic.define.widget.props.SelectOption;
import com.srm.bpm.logic.define.widget.props.SourceTypeAsync;
import com.srm.bpm.logic.define.widget.props.SourceTypeRely;
import com.srm.bpm.logic.dto.FormTableFieldDto;

/**
 * <p> 下拉复选框 属性 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class MultiselectWidget extends AbstractWidget {

    /**
     * 是否允许重复值
     */
    private boolean allowRepetition;

    /**
     * 选项
     */
    private List<SelectOption> items;

    /**
     * 默认值
     */
    private String value;

    /**
     * 数据来源类型
     */
    private WidgeSourceType sourceType;

    /**
     * 下拉数据源
     */
    private SourceTypeAsync async;
    /**
     * 联动配置
     */
    private SourceTypeRely rely;

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

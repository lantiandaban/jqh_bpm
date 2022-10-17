

package com.srm.bpm.logic.define.widget;

import com.google.common.collect.Lists;

import java.util.Collections;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.bpm.logic.define.WidgeSourceType;
import com.srm.bpm.logic.define.widget.props.SelectItem;
import com.srm.bpm.logic.define.widget.props.SourceTypeAsync;
import com.srm.bpm.logic.define.widget.props.SourceTypeRely;
import com.srm.bpm.logic.dto.FormTableFieldDto;

/**
 * <p> Select 选择属性 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class SelectWidget extends AbstractWidget {


    /**
     * 值类型
     */
    private WidgeSourceType sourceType;
    /**
     * 是否重复值
     */
    private boolean allowRepetition;
    /**
     * 允许重复值
     */
    private boolean allowRepetitiony;

    /**
     * 选项
     */
    private List<SelectItem> items;
    /**
     * 数据下拉获取
     */
    private SourceTypeAsync async;
    /**
     * 联动配置信息
     */
    private SourceTypeRely rely;

    @Override
    public <T> List<T> items() {
        return Collections.emptyList();
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

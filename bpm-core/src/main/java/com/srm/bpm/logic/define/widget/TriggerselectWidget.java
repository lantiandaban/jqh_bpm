

package com.srm.bpm.logic.define.widget;

import com.google.common.collect.Lists;

import java.util.Collections;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.bpm.logic.define.widget.props.FormDatasource;
import com.srm.bpm.logic.define.widget.props.FormDatasourceTable;
import com.srm.bpm.logic.dto.FormTableFieldDto;

/**
 * <p> 弹出选择 属性 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class TriggerselectWidget extends AbstractWidget {

    /**
     *弹出数据源
     */
    private FormDatasource datasource;

    /**
     * 显示数据源字段
     */
    private String displayField;
    /**
     * 存储值对应数据源字段
     */
    private String valueField;

    /**
     * 是否可以多选
     */
    private boolean multiSelect;


    @Override
    public <T> List<T> items() {
        return Collections.emptyList();
    }

    @Override
    public FormFieldEntity toField(long formId, int sort, long detailFiledId) {
        final FormFieldEntity formField = super.toField(formId, sort, detailFiledId);
        final FormDatasource datasource = this.getDatasource();
        if (datasource != null) {
            final FormDatasourceTable table = datasource.getTable();
            if (table != null) {
                formField.setDatasourceCode(table.getName());
            }
        }
        return formField;
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

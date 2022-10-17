

package com.srm.bpm.logic.define.widget;

import com.google.common.collect.Lists;

import com.alibaba.fastjson.JSON;

import java.util.Collections;
import java.util.List;

import cn.hutool.core.collection.CollectionUtil;
import lombok.Data;
import lombok.EqualsAndHashCode;
import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.bpm.logic.define.WidgetOnlyType;
import com.srm.bpm.logic.define.widget.props.Linkquery;
import com.srm.bpm.logic.dto.FormTableFieldDto;

/**
 * <p> 明细控件 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class DetailgroupWidget extends AbstractWidget {

    /**
     * 明细中的控件信息
     */
    private List<String> items;

    /**
     * 级联查询配置
     */
    private Linkquery linkquery;

    @Override
    public <T> List<T> items() {

        if (CollectionUtil.isEmpty(items)) {
            return Collections.emptyList();
        } else {

            final List<WidgetField> itemFields = Lists.newArrayList();

            for (String item : items) {
                final WidgetOnlyType typeWidget = JSON.parseObject(item, WidgetOnlyType.class);
                if (typeWidget != null) {
                    final WidgetField widgetField = typeWidget.getXtype().toField(item);
                    itemFields.add(widgetField);
                }
            }
            return (List<T>) itemFields;
        }

    }

    @Override
    public List<FormTableFieldDto> toTableField() {
        return Collections.emptyList();
    }

    @Override
    public FormFieldEntity toField(long formId, int sort) {
        return toField(formId, sort, 0);
    }
}

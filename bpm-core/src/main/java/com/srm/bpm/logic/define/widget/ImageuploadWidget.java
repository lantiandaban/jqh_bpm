

package com.srm.bpm.logic.define.widget;

import com.google.common.collect.Lists;

import java.util.Collections;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.bpm.logic.dto.FormTableFieldDto;

/**
 * <p> 图片上传 属性 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class ImageuploadWidget extends AbstractWidget {


    /**
     * 是否允许多图片上传
     */
    private boolean allowMulti;
    /**
     * 是否允许访问相册
     */
    private boolean onlyCamera;
    /**
     * 按钮文字
     */
    private String buttonTitle;

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

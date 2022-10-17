

package com.srm.bpm.logic.define.widget;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;

import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.bpm.logic.constant.FormConst;
import com.srm.bpm.logic.define.FormXtype;
import com.srm.bpm.logic.dto.FormTableFieldDto;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
public abstract class AbstractWidget implements WidgetField {

    /**
     * 表单标识，物理表的字段
     */
    protected String widgetName;
    /**
     * 标题
     */
    protected String title;
    /**
     * 提示文字
     */
    protected String placeholder;

    /**
     * 描述
     */
    protected String desc;
    /**
     * 是否必须填写
     */
    protected boolean required;
    /**
     * 是否显示
     */
    protected boolean visible;
    /**
     * 是否只读
     */
    protected boolean readonly;
    /**
     * 表单字段类型
     */
    private FormXtype xtype;


    public String getWidgetName() {
        return widgetName;
    }

    public void setWidgetName(String widgetName) {
        this.widgetName = widgetName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPlaceholder() {
        return placeholder;
    }

    public void setPlaceholder(String placeholder) {
        this.placeholder = placeholder;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    public boolean isReadonly() {
        return readonly;
    }

    public void setReadonly(boolean readonly) {
        this.readonly = readonly;
    }

    public FormXtype getXtype() {
        return xtype;
    }

    public void setXtype(FormXtype xtype) {
        this.xtype = xtype;
    }

    @Override
    public FormFieldEntity toField(long formId, int sort, long detailFiledId) {
        final FormFieldEntity formField = new FormFieldEntity();
        formField.setTitle(this.getTitle());
        formField.setFormId(formId);
        formField.setWidgetName(this.getWidgetName());
        formField.setType(xtype.toString());
        formField.setDescription(this.getDesc());
        formField.setPlaceholder(this.getPlaceholder());
        formField.setRequired(this.isRequired()?1:0);
        formField.setSort(sort);
        formField.setFieldId(detailFiledId);
        formField.setProps(JSON.toJSONString(this,
                SerializerFeature.WriteMapNullValue,
                SerializerFeature.WriteNullNumberAsZero,
                SerializerFeature.WriteNullBooleanAsFalse,
                SerializerFeature.DisableCircularReferenceDetect));
        return formField;
    }


    @Override
    public String title() {
        return this.getTitle();
    }


    FormTableFieldDto createVarcharField() {

        FormTableFieldDto formTableField = new FormTableFieldDto();
        formTableField.setComment(title);
        formTableField.setFieldName(widgetName);
        formTableField.setDataType("varchar(255)");
        return formTableField;
    }

    FormTableFieldDto createTextExtField() {

        FormTableFieldDto formTableField = new FormTableFieldDto();
        formTableField.setComment(title + "--扩展");
        formTableField.setFieldName(widgetName + FormConst.FIELD_EXT_NAME);
        formTableField.setDataType("text");
        return formTableField;
    }
}

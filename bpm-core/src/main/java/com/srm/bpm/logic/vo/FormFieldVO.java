

package com.srm.bpm.logic.vo;

import com.google.common.base.Strings;

import com.srm.bpm.logic.constant.StringPool;
import com.srm.bpm.logic.define.FormXtype;

import org.apache.commons.lang3.StringUtils;

import java.io.Serializable;
import java.util.List;

import cn.hutool.core.util.StrUtil;
import lombok.Data;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class FormFieldVO implements Serializable {
    private static final long serialVersionUID = 6060981688920369374L;


    /**
     * 物理主键
     */
    private Long id;
    /**
     * 表单主键
     */
    private Long formId;
    /**
     * 字段标题
     */
    private String title;
    /**
     * 字段类型
     */
    private String type;
    /**
     * 表单控件标识
     */
    private String widgetName;

    private String bizType;
    /**
     * 字段描述
     */
    private String description;
    /**
     * 提示文本
     */
    private String placeholder;
    /**
     * 数据源编码
     */
    private String datasourceCode;

    /**
     * 字段属性
     */
    private String props;
    /**
     * 必填标记;1-必填;0-非必填
     */
    private Integer required;

    private int sort;

    /**
     * 明细字段下的字段信息
     */
    private List<FormFieldVO> detailFields;


    public String defaultValue() {
        if (Strings.isNullOrEmpty(type)) {
            return StringPool.EMPTY;
        }
        if (StringUtils.equals(type, FormXtype.radiogroup.name())) {
            return StrUtil.EMPTY_JSON;
        } else if (StringUtils.equals(type, FormXtype.checkboxgroup.name())) {
            return "[]";
        } else if (StringUtils.equals(type, FormXtype.select.name())) {
            return StrUtil.EMPTY_JSON;
        } else if (StringUtils.equals(type, FormXtype.multiselect.name())) {
            return "[]";
        } else if (StringUtils.equals(type, FormXtype.location.name())) {
            return StrUtil.EMPTY_JSON;
        } else if (StringUtils.equals(type, FormXtype.triggerselect.name())) {
            return "[]";
        } else if (StringUtils.equals(type, FormXtype.imageupload.name())) {
            return "[]";
        } else if (StringUtils.equals(type, FormXtype.fileupload.name())) {
            return "[]";
        }

        return StringPool.EMPTY;
    }
}

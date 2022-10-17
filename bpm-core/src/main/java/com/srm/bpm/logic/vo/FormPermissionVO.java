

package com.srm.bpm.logic.vo;

import java.io.Serializable;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class FormPermissionVO implements Serializable{
    private static final long serialVersionUID = -3205253680638108855L;

    /**
     * 表单控件标识
     */
    private String widgetName;

    /**
     * 是否显示,`true`显示
     */
    private boolean hidden;

    /**
     * 是否可编辑,`true`可编辑
     */
    private boolean edit;
}

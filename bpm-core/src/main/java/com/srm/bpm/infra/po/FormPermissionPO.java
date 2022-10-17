 

package com.srm.bpm.infra.po;

import java.io.Serializable;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
public class FormPermissionPO implements Serializable {
    private static final long serialVersionUID = 5546683144732286370L;
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

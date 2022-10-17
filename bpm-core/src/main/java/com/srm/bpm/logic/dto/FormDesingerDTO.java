

package com.srm.bpm.logic.dto;

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
public class FormDesingerDTO implements Serializable {
    private Long id;
    /**
     * 表单id
     */
    private Long formId;

    /**
     * 表单json
     */
    private String desingerJson;

    /**
     * 表单布局
     */
    private String layout;

    /**
     * 表单列
     */
    private String columns;
}

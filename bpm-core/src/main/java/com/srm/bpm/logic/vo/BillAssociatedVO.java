

package com.srm.bpm.logic.vo;

import java.io.Serializable;

import lombok.Data;

/**
 * <p> 审批数据 关联信息 模型 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class BillAssociatedVO implements Serializable {
    private static final long serialVersionUID = 8445558406719807749L;


    /**
     * 关联数据ID
     */
    private String id;

    /**
     * 关联信息图标
     */
//    private AssociatedIcon icon;

    /**
     * 关联标题
     */
    private String title;

    /**
     * 关联内容
     */
    private String content;

    /**
     * 名称
     */
    private String name;

}

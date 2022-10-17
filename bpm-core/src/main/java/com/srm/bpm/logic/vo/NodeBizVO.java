

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
public class NodeBizVO implements Serializable{
    private static final long serialVersionUID = 4813965679248235729L;


    /**
     * 1 表示项目经理; 2-表示总监; 3-表示售前负责人
     */
    private int type;

    /**
     * 暂时冗余，后续可能会使用 表字段名称
     */
    private String filed;

}

 

package com.srm.bpm.logic.vo;

import java.util.List;

import lombok.Data;

/**
 * <p> 流程节点之前的关系条件 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class LineConditionVO {

    /**
     * 权重
     */
    private int weight;
    private List<ConditionVo> condition;

}

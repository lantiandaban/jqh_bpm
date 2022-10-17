 

package com.srm.bpm.logic.vo;

import java.util.List;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class NodeCcVO {

    private List<ConditionVo> condition;


    /**
     * 抄送人
     */
    private List<NodeSubjectVO> subject;

    private int weight;

}



package com.srm.bpm.logic.vo;

import java.io.Serializable;
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
public class NodeApproverVO implements Serializable {

    private static final long serialVersionUID = 4223852676959209433L;
    private List<ConditionVo> condition;


    private List<NodeSubjectVO> subject;

    private CountersignVO countersign;

    private int weight;
}

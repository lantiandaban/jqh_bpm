

package com.srm.bpm.logic.comparator;

import com.google.common.primitives.Ints;

import com.srm.bpm.logic.vo.NodeApproverVO;

import java.util.Comparator;


/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
public class NodeApproverComparator implements Comparator<NodeApproverVO> {
    @Override
    public int compare(NodeApproverVO o1, NodeApproverVO o2) {
        return Ints.compare(o1.getWeight(), o2.getWeight());
    }
}

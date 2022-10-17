

package com.srm.bpm.logic.comparator;

import com.google.common.primitives.Ints;

import com.srm.bpm.logic.vo.NodeCcVO;

import java.util.Comparator;


/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
public class NodeCcComparator implements Comparator<NodeCcVO> {
    @Override
    public int compare(NodeCcVO o1, NodeCcVO o2) {
        return Ints.compare(o1.getWeight(), o2.getWeight());
    }
}

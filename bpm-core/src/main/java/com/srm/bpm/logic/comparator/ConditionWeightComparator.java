

package com.srm.bpm.logic.comparator;

import com.google.common.primitives.Ints;

import com.srm.bpm.logic.vo.LineConditionVO;

import java.util.Comparator;


/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
public class ConditionWeightComparator implements Comparator<LineConditionVO> {
    @Override
    public int compare(LineConditionVO o1, LineConditionVO o2) {
        return Ints.compare(o1.getWeight(), o2.getWeight());
    }
}

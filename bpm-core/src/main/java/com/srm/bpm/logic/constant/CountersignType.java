

package com.srm.bpm.logic.constant;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public enum CountersignType {
    ONE_PASS(1), ONE_REJECT(2), COUNT_PASS(3), PERCENTAGE_PASS(4);
    private int val;

    CountersignType(int val) {
        this.val = val;
    }

    public int getVal() {
        return val;
    }
}

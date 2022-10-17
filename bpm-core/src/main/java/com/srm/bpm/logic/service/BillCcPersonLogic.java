

package com.srm.bpm.logic.service;

import java.util.Set;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface BillCcPersonLogic {
    void saveBillCc(Set<String> ccUsers, long billId, String nodeId, String processFlowId);
}

 

package com.srm.bpm.logic.service;

import org.springframework.transaction.annotation.Transactional;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface BillCodeLogic {

    @Transactional(readOnly = true)
    String execCodeRule(long codeId, long processId, long processTypeId);
}

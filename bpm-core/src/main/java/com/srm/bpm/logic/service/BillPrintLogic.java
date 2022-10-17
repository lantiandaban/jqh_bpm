

package com.srm.bpm.logic.service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface BillPrintLogic {
    void download(Long billId, HttpServletResponse resp, HttpServletRequest request);

    String print(Long billId);
}

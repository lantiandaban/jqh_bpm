

package com.srm.bpm.logic.service;

import java.util.Map;

import com.srm.bpm.infra.entity.BillDataJsonEntity;
import com.srm.bpm.logic.context.BillDataContext;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface BillDataJsonLogic {
    BillDataJsonEntity saveByBillData(BillDataContext billDataValue, String formDataJson);

    boolean updateByBillId(long billId, Map<String, Object> dataMap);

}



package com.srm.bpm.logic.query.list;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>My approval list query object  </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class ApprovedBillQuery extends DraftBillQuery {
    private static final long serialVersionUID = 451118446258098353L;


    /**
     * 发起人
     */
    private long sender;
    
    private String senderName;



}

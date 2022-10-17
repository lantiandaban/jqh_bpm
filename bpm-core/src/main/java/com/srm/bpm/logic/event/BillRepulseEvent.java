

package com.srm.bpm.logic.event;

import java.io.Serializable;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
public class BillRepulseEvent implements Serializable {
    private static final long serialVersionUID = 8779618350636501650L;
    private long billId;
    private long processId;
}

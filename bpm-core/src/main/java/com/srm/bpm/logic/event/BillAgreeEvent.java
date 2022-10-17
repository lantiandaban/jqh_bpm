

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
public class BillAgreeEvent implements Serializable {
    private static final long serialVersionUID = 4671029515514384401L;
    private long billId;
    private long processId;
}

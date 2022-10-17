

package com.srm.bpm.logic.event;

import java.io.Serializable;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class BillRefuseEvent implements Serializable {
    private static final long serialVersionUID = -4207823009739854324L;
    private long billId;
    private long processId;
}

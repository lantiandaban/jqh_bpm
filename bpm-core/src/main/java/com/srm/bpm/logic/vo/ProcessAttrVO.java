

package com.srm.bpm.logic.vo;

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
public class ProcessAttrVO implements Serializable{
    private static final long serialVersionUID = -355172852097696262L;

    private boolean allowRevoke;
}



package com.srm.bpm.logic.dto;

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
public class DatasourcePagingDto implements Serializable{
    private static final long serialVersionUID = -6728538462953480715L;

    private boolean enable;

    private int pageSize;
}

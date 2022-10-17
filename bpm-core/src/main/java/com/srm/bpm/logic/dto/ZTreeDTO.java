 

package com.srm.bpm.logic.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
public class ZTreeDTO implements Serializable {
    private static final long serialVersionUID = -4434482928560990215L;
    private String id;
    private String pid;
    private String name;
    private boolean checked;
    private boolean nocheck;
    private boolean open = false;
    private boolean chkDisabled;
    private boolean halfCheck;
    private boolean hidden;
    private boolean parent=true;
    private List<ZTreeDTO> children;
    private String url;
    private String target;
    private Object data;
}

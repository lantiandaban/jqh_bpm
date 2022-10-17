 

package com.srm.bpm.logic.vo;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class ProcessDesingerVO implements Serializable{
    private static final long serialVersionUID = -4803137706190524858L;

    private boolean enable;

    private List<ProcessNodeVO> nodeSettings;
    private ProcessAttrVO attr;

    private String xml;


}

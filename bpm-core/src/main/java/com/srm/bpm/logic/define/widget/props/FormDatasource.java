

package com.srm.bpm.logic.define.widget.props;

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
public class FormDatasource implements Serializable {
    private static final long serialVersionUID = -736284151920487201L;

    private FormDatasourceTable table;


    private String type;
}

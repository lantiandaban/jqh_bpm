

package com.srm.bpm.logic.define.widget.props;


import java.io.Serializable;
import java.util.List;

import lombok.Data;
import com.srm.bpm.logic.dto.DatasourceFieldDto;
import com.srm.bpm.logic.dto.DatasourcePagingDto;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class FormDatasourceTable implements Serializable {
    private static final long serialVersionUID = -2966685582595476475L;

    private String name;

    private DatasourcePagingDto paging;


    private List<DatasourceFieldDto> searchItems;
    private List<DatasourceFieldDto> tableColumns;

}

 

package com.srm.bpm.logic.dto;

import com.srm.bpm.facde.dto.DatasourceDTO;

import java.io.Serializable;
import java.util.List;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
@ApiModel("数据源表单传输数据")
public class DataSourceFormDTO implements Serializable {

    private static final long serialVersionUID = 5414919823402513174L;

    @ApiModelProperty("数据源")
    private DatasourceDTO dataSource;

    @ApiModelProperty("数据源字段")
    private List<DatasourceFiledDTO> fileds;

    @ApiModelProperty("数据源条件")
    private List<DatasourceConditionDTO> conditions;

    @ApiModelProperty("数据源下拉")
    private DatasourceComboDTO combo;

    @ApiModelProperty("数据源弹框")
    private DatasourcePopoverDTO popover;

}

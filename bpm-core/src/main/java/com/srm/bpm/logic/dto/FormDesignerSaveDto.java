

package com.srm.bpm.logic.dto;

import java.util.List;

import io.swagger.annotations.ApiModel;
import lombok.Data;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
@ApiModel("表单保存对象")
public class FormDesignerSaveDto {

    private FormAttrDto attr;


    private List<List<FormColumnDto>> columnItems;
}

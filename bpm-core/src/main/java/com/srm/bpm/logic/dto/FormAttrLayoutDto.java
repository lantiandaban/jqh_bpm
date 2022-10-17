

package com.srm.bpm.logic.dto;

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
public class FormAttrLayoutDto {
    private List<FormAttrLayoutColgroupDto> colgroup;

    private String width;
}

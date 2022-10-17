

package com.srm.bpm.logic.define.widget;


import java.util.List;

import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.bpm.logic.dto.FormTableFieldDto;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
public interface WidgetField {

   <T> List<T> items();


    List<FormTableFieldDto> toTableField();


    FormFieldEntity toField(long formId, int sort, long detailFiledId);

    FormFieldEntity toField(long formId, int sort);

    String title();

}

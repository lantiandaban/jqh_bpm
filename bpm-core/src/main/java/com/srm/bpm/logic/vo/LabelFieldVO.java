

package com.srm.bpm.logic.vo;

import java.io.Serializable;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
public class LabelFieldVO implements Serializable {
    private static final long serialVersionUID = 609011897081822763L;
    private String label;

    private String field;


    public DatasourceFieldVO toFieldVO(){
        DatasourceFieldVO fieldVO = new DatasourceFieldVO();
        fieldVO.setField(this.getField());
        fieldVO.setName(this.getLabel());
        return fieldVO;
    }
}

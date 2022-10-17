

package com.srm.bpm.logic.dto;

import com.google.common.primitives.Ints;

import java.io.Serializable;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author Administrator
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class BillItemFieldDto implements Serializable, Comparable<BillItemFieldDto> {
    private static final long serialVersionUID = 2912012438670082895L;
    private long id;
    private long fieldId;
    private String fieldName;
    private String fieldCode;
    private Object dataVal;
    private String dataValExt;
    private String fieldType;
    private String fieldProps;
    private int type;
    private int sort;

    @Override
    public int compareTo(BillItemFieldDto o) {
        return Ints.compare(this.getSort(), o.getSort());
    }
}

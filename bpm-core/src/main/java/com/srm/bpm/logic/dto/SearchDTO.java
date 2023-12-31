 

package com.srm.bpm.logic.dto;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchDTO {

    /**
     * Global search value. To be applied to all columns which have searchable as true.
     */
    @NotNull
    private String value;

    /**
     * true if the global filter should be treated as a regular expression for advanced searching,
     * false otherwise. Note that normally server-side processing scripts will not perform regular
     * expression searching for performance reasons on large data sets, but it is technically
     * possible and at the discretion of your script.
     */
    @NotNull
    private Boolean regex;
}

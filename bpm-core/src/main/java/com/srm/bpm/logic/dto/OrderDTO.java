

package com.srm.bpm.logic.dto;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

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
public class OrderDTO {

    /**
     * Column to which ordering should be applied. This is an index reference to the columns array
     * of information that is also submitted to the server.
     */
    @NotNull
    @Min(0)
    private Integer column;

    /**
     * Ordering direction for this column. It will be asc or desc to indicate ascending ordering or
     * descending ordering, respectively.
     */
    @NotNull
    @Pattern(regexp = "(desc|asc)")
    private String dir;
}

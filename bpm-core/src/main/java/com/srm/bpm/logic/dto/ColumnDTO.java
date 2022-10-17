

package com.srm.bpm.logic.dto;

import org.hibernate.validator.constraints.NotBlank;

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
public class ColumnDTO {

    /**
     * Column's data source
     *
     * http://datatables.net/reference/option/columns.data
     */
    @NotBlank
    private String data;

    /**
     * Column's name
     *
     * http://datatables.net/reference/option/columns.name
     */
    private String name;

    /**
     * Flag to indicate if this column is searchable (true) or not (false).
     *
     * http://datatables.net/reference/option/columns.searchable
     */
    @NotNull
    private Boolean searchable;

    /**
     * Flag to indicate if this column is orderable (true) or not (false).
     *
     * http://datatables.net/reference/option/columns.orderable
     */
    @NotNull
    private Boolean orderable;

    /**
     * Search value to apply to this specific column.
     */
    @NotNull
    private SearchDTO search;

    /**
     * Set the search value to apply to this column
     *
     * @param searchValue if any, the search value to apply
     */
    public void setSearchValue(String searchValue) {
        this.search.setValue(searchValue);
    }
}

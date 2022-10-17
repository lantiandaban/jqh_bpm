

package com.srm.bpm.logic.define.widget.props;

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
public class SourceTypeRely {

    private String field;

    private SourceTypeRelyRef ref;

    private List<String> widgets;
}

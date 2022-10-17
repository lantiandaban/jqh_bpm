

package com.srm.bpm.logic.define.widget.props;

import java.util.List;
import java.util.Map;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author Administrator
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class Linkquery {
    private String table;
    private String[] widgets;
    private String block;
    private List<Map<String, String>> conditions;
    private String url;
}

 

package com.srm.common.util.tree;

import com.google.common.collect.Lists;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
public class TreeVO implements Serializable {
    private static final long serialVersionUID = -7724114053557693788L;
    /**
     * 父级id
     */
    private String id;
    private String parentId;
    private List<Object> children= Lists.newArrayList();
}

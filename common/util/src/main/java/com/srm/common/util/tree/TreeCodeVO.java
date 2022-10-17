

package com.srm.common.util.tree;

import com.google.common.collect.Lists;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class TreeCodeVO implements Serializable {
    private static final long serialVersionUID = -7724114053557693788L;

    private Long id;
    private String code;
    /**父级code*/
    private String parentCode;
    private String name;
    private List<TreeCodeVO> children = Lists.newArrayList();
}

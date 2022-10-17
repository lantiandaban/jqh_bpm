

package com.srm.bpm.logic.vo;

import java.util.List;

import lombok.Data;

/**
 * <p> 流程类型VO </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class ProcessTypeVO {

    private long id;
    private String name;
    private String code;


    private List<ProcessVO> flows;
}

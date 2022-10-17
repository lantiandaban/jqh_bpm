

package com.srm.bpm.logic.dto;

import com.srm.bpm.facde.dto.BaseProcessDTO;

import java.io.Serializable;

import io.swagger.annotations.ApiModel;
import lombok.Data;

/**
 * <p> 流程明细信息 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
@ApiModel("流程详情")
public class ProcessDetailDTO extends BaseProcessDTO implements Serializable {
    private static final long serialVersionUID = 5889084938710800176L;
    /**
     * 流程主键
     */
    private String flowId;
    /**
     * 名称拼音
     */
    private String domain;
    /**
     * 英文名称
     */
    private String enName;
    /**
     * 流程类型编码
     */
    private String typeCode;
    /**
     * 流程类型名称
     */
    private String typeName;
    /**
     * 可用标记
     */
    private int status;
    /**
     * 关闭标记.0-未关闭;1-关闭
     */
    private Integer closeFlag;
    /**
     * 流程描述
     */
    private String description;
    /**
     * 当前版本
     */
    private String version;
    /**
     * 说明文档信息
     */
    private String usageFile;
    /**
     * 是否有明细字段
     */
    private boolean detailFieldFlag;


}

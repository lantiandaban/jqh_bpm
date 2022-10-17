

package com.srm.bpm.infra.po;

import java.io.Serializable;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
public class ProcessDetailPO implements Serializable {
    private static final long serialVersionUID = -6899110252369366843L;

    /**
     * 物理主键
     */
    private long id;
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
    private String name;
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

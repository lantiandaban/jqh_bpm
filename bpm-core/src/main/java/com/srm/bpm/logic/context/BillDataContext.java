

package com.srm.bpm.logic.context;


import com.srm.bpm.infra.entity.BillBizDataEntity;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import lombok.Builder;
import lombok.Data;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
@Builder
public class BillDataContext implements Serializable {
    private static final long serialVersionUID = -3112871354918410388L;

    /**
     * 是否为新建
     */
    private boolean created;
    /**
     * 审批单ID
     */
    private long id;
    /**
     * 业务流程ID
     */
    private long processId;
    /**
     * 审批标题
     */
    private String title;

    /**
     * 审批编码
     */
    private String code;
    /**
     * 业务数据
     */
    private List<BillBizDataEntity> bizDataList;
    /**
     * 项目类型
     */
    private List<String> projectTypes;

    /**
     * 当前申请人的项目角色关系
     */
    private String projectRole;

    /**
     * 概要信息 JSON 格式
     */
    private String outline;

    /**
     * 关联信息 JSON 格式
     */
    private String associated;


    /**
     * 是否有附件
     */
    private boolean attachment;
    /**
     * 表单数据
     */
    private Map<String, Object> formDataMap;


    private List<String> errorMessage;

    private boolean error;

}

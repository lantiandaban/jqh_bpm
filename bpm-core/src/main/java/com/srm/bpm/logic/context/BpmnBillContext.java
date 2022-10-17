

package com.srm.bpm.logic.context;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import com.srm.bpm.logic.constant.BpmnConst;
import com.srm.bpm.logic.dto.OrganizationBpmnDTO;
import com.srm.bpm.logic.dto.PositionBpmnDTO;
import com.srm.bpm.logic.constant.LineConditionConst;

import org.apache.commons.lang3.StringUtils;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import cn.hutool.core.collection.CollectionUtil;
import lombok.Data;


/**
 * <p> 业务流程审批单所需要的计算上下文，转换为JSON存储到流程变量中 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class BpmnBillContext implements Serializable {
    private static final long serialVersionUID = -988633119855312577L;

    /**
     * 员工ID
     */
    private String id;

    /**
     * 员工编号
     */
    private String code;
    /**
     * 员工姓名
     */
    private String name;

    /**
     * 企业部门
     */
    private OrganizationBpmnDTO org;

    /**
     * 员工在指定部门的职位信息
     */
    private List<PositionBpmnDTO> positions;

    /**
     * 申请的项目类型
     */
    private List<String> projectTypes;

    /**
     * 申请的客户类型
     */
    private List<String> customerTypes;


    public Map<String, Object> toEnvParam(String express) {

        Map<String, Object> env = Maps.newHashMap();
        if (StringUtils.contains(express, LineConditionConst.VAR_AE_POSITION)) {
            List<Object> empPositions = Lists.newArrayList();
            final List<PositionBpmnDTO> positions = this.getPositions();
            if (CollectionUtil.isNotEmpty(positions)) {
                for (PositionBpmnDTO position : positions) {
                    empPositions.add(String.valueOf(position.getId()));
                }
            }
            env.put(LineConditionConst.VAR_AE_POSITION, empPositions);
        }
        if (StringUtils.contains(express, LineConditionConst.VAR_AE_ORGANIZATION)) {
            final OrganizationBpmnDTO employeeOrg = this.getOrg();
            String orgId = "";
            if (employeeOrg != null) {
                orgId = String.valueOf(employeeOrg.getId());
            }
            env.put(LineConditionConst.VAR_AE_ORGANIZATION, orgId);
        }
        if (StringUtils.contains(express, BpmnConst.VAR_PORJCET_TYPE)) {
            if (CollectionUtil.isNotEmpty(projectTypes)) {
                // 暂时只支持处理一个
                env.put(BpmnConst.VAR_PORJCET_TYPE, projectTypes.get(0));
            }
        }
        return env;
    }
}

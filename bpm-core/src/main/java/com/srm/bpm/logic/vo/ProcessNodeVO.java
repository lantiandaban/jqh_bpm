

package com.srm.bpm.logic.vo;

import com.google.common.collect.Lists;

import com.srm.bpm.infra.entity.ProcessNodeFormFieldEntity;
import com.srm.bpm.logic.constant.BillAction;
import com.srm.bpm.logic.constant.NodeLinkType;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import cn.hutool.core.collection.CollectionUtil;
import lombok.Data;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class ProcessNodeVO implements Serializable {


    private static final long serialVersionUID = -8473379548632314058L;

    private String desc;

    private String nodeId;

    private NodeLinkType linkType;

    private BillAction actionType;

    private String ntype;
    private String title;
    private BigDecimal autoNextHours;
    private String autoAgree;
    private String btns;
    private Integer countersignFlag;
    private Integer batchApproval;
    private Integer noApprovalOperation;
    private Integer selectApproval;


    private List<LineConditionVO> conditions;
    private List<NodeApproverVO> approver;
    private List<NodeCcVO> cc;

    /**
     * 自定义节点监听器，一段Class的类明
     */
    private String listeners;

    /**
     * 字段控制
     */
    private Map<String, Integer> permissions;


    public List<ProcessNodeFormFieldEntity> toFormField(long processId) {
        if (CollectionUtil.isEmpty(permissions)) {
            return Collections.emptyList();
        }
        List<ProcessNodeFormFieldEntity> formFields = Lists.newArrayListWithCapacity(permissions.size());
        final LocalDateTime now = LocalDateTime.now();
        for (String key : permissions.keySet()) {
            ProcessNodeFormFieldEntity nodeFormField = new ProcessNodeFormFieldEntity();
            nodeFormField.setFormWidgetName(key);
            nodeFormField.setNodeId(nodeId);
            int type = permissions.get(key);
            // 0 不可编辑 同时 不可见
            // 1 可编辑但不可见
            // 2 不可编辑但可见
            // 3 是 即可见也可以编辑
            switch (type) {
                case 0:
                    nodeFormField.setEditFlag(0);
                    nodeFormField.setVisibleFlag(0);
                    break;
                case 1:
                    nodeFormField.setEditFlag(1);
                    nodeFormField.setVisibleFlag(0);
                    break;
                case 2:
                    nodeFormField.setEditFlag(0);
                    nodeFormField.setVisibleFlag(1);
                    break;
                case 3:
                    nodeFormField.setEditFlag(1);
                    nodeFormField.setVisibleFlag(1);
                    break;
                default:
                    nodeFormField.setEditFlag(0);
                    nodeFormField.setVisibleFlag(0);
                    break;
            }
            nodeFormField.setUpdateTime(now);
            nodeFormField.setProcessId(processId);
            formFields.add(nodeFormField);
        }
        return formFields;
    }

}

 

package com.srm.bpm.logic.service.impl;

import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;

import com.alibaba.fastjson.JSON;
import com.googlecode.aviator.AviatorEvaluator;
import com.srm.bpm.infra.entity.ProcessNodeCcEntity;
import com.srm.bpm.infra.service.ProcessNodeCcService;
import com.srm.bpm.logic.constant.SubjectHrType;
import com.srm.bpm.logic.context.BpmnBillContext;
import com.srm.bpm.logic.service.NodeCcLogic;
import com.srm.bpm.logic.service.UserCenterlogic;
import com.srm.bpm.logic.vo.NodeSubjectVO;
import com.srm.bpm.logic.constant.BpmnConst;

import org.activiti.engine.delegate.DelegateTask;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

import cn.hutool.core.collection.CollectionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static com.srm.bpm.logic.constant.FastJsonType.MAP_OBJECT_TR;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NodeCcLogicImpl implements NodeCcLogic {
    private final ProcessNodeCcService processNodeCcService;
    private final UserCenterlogic userCenterlogic;

    /**
     * 解析节点的抄送配置，返回抄送人的信息
     *
     * @param flowId       流程标记
     * @param nodeId       节点ID
     * @param delegateTask 任务信息
     * @return 审批人
     */
    @Override
    public Set<String> resolve(String flowId, String nodeId, DelegateTask delegateTask, List<String> approverEmployeeIds) {
        final String businessKey = delegateTask.getExecution().getProcessInstanceBusinessKey();
        // 取得审批人信息
        final List<ProcessNodeCcEntity> ccUsers = processNodeCcService.findByFlowIdAndNodeId(flowId, nodeId);
        if (CollectionUtil.isEmpty(ccUsers)) {
            log.warn("the node {} and billId {} has not ccUsers!!!", nodeId, businessKey);
            return Collections.emptySet();
        }
        // 取得各个流程变量
        final Map<String, Object> formDataMap;
        formDataMap = (Map<String, Object>) delegateTask.getVariable(BpmnConst.VAR_FORM_DATA);
        final String billContextJSON = (String) delegateTask.getVariable(BpmnConst.VAR_BILL_CONTEXT);
        BpmnBillContext billContext = JSON.parseObject(billContextJSON, BpmnBillContext.class);
        Set<String> employeeApprovers = Sets.newHashSet();
        for (ProcessNodeCcEntity ccUser : ccUsers) {
            String tmpCcUser = ccUser.getCc();
            if (Strings.isNullOrEmpty(tmpCcUser)) {
                continue;
            }
            String express = ccUser.getExpress();
            if (Strings.isNullOrEmpty(express)) {
                final List<NodeSubjectVO> nodeSubjectVOS;
                nodeSubjectVOS = JSON.parseArray(tmpCcUser, NodeSubjectVO.class);
                for (NodeSubjectVO nodeSubjectVO : nodeSubjectVOS) {
                    final Set<String> employees;
                    employees = resolveSubject(nodeSubjectVO, billContext, approverEmployeeIds);
                    employeeApprovers.addAll(employees);
                }
            } else {
                final String expressParams = ccUser.getExpressParams();
                Map<String, Object> env = Maps.newHashMap();
                if (StringUtils.contains(express, BpmnConst.VAR_FORM_DATA)) {
                    env.put(BpmnConst.VAR_FORM_DATA, formDataMap);
                }
                env.putAll(billContext.toEnvParam(express));
                if (!Strings.isNullOrEmpty(expressParams)) {
                    env.putAll(JSON.parseObject(expressParams, MAP_OBJECT_TR));
                }
                final Boolean conditionResult = (Boolean) AviatorEvaluator.execute(express, env);
                if (conditionResult) {
                    final List<NodeSubjectVO> nodeSubjectVOS;
                    nodeSubjectVOS = JSON.parseArray(tmpCcUser, NodeSubjectVO.class);
                    for (NodeSubjectVO nodeSubjectVO : nodeSubjectVOS) {
                        final Set<String> employees;
                        employees = resolveSubject(nodeSubjectVO, billContext, approverEmployeeIds);
                        employeeApprovers.addAll(employees);
                    }

                }
            }
        }
        return employeeApprovers;
    }

    private Set<String> resolveSubject(NodeSubjectVO nodeSubject, BpmnBillContext applyEmployee,
                                       List<String> approvarEmployeeId) {
        Set<String> userIdStrs = Sets.newHashSet();
        final int type = nodeSubject.getType();
        switch (type) {
            case SubjectHrType.EMPLOYEE: {
                // 指定人员
                userIdStrs.addAll(nodeSubject.assignEmployee());
                break;
            }
            case SubjectHrType.ORGANIZATION: {
                //发起人直属领导
                //todo 发起人领导
                final String userId = applyEmployee.getId();
                final Set<String> userIds = userCenterlogic.getLeaderIdByUserIds(Lists.newArrayList(userId));
                userIdStrs.addAll(userIds);
                break;
            }
            case SubjectHrType.POSITION: {
                //审批人领导
                final Set<String> userIds = userCenterlogic.getLeaderIdByUserIds(approvarEmployeeId);
                userIdStrs.addAll(userIds);
                break;
            }
            default:
                break;
        }
        return userIdStrs;
    }
}

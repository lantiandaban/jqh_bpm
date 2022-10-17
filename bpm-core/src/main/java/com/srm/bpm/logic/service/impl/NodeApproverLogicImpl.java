

package com.srm.bpm.logic.service.impl;

import com.google.common.base.Strings;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;

import com.alibaba.fastjson.JSON;
import com.googlecode.aviator.AviatorEvaluator;
import com.srm.bpm.infra.entity.ProcessNodeApproverEntity;
import com.srm.bpm.infra.service.ProcessNodeApproverService;
import com.srm.bpm.logic.constant.SubjectHrType;
import com.srm.bpm.logic.constant.SubjectOrgType;
import com.srm.bpm.logic.constant.SubjectType;
import com.srm.bpm.logic.context.BpmnBillContext;
import com.srm.bpm.logic.service.LoginUserHolder;
import com.srm.bpm.logic.service.NodeApproverLogic;
import com.srm.bpm.logic.service.UserCenterlogic;
import com.srm.bpm.logic.vo.FieldVO;
import com.srm.bpm.logic.vo.NodeSubjectVO;
import com.srm.bpm.logic.vo.TreeDataVO;
import com.srm.bpm.logic.constant.BpmnConst;
import com.srm.bpm.logic.constant.FastJsonType;

import org.activiti.engine.delegate.DelegateTask;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static com.google.common.base.MoreObjects.firstNonNull;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class NodeApproverLogicImpl implements NodeApproverLogic {
    private final ProcessNodeApproverService processNodeApproverService;
    private final UserCenterlogic userCenterlogic;
    private final LoginUserHolder loginUserHolder;

    /**
     * 解析节点审批人配置，取得审批人，如果没有则返回空
     *
     * @param flowId       流程标记
     * @param nodeId       节点ID
     * @param delegateTask 任务信息
     * @return 审批人
     */
    @Override
    public Map<Long, Set<String>> resolve(String flowId, String nodeId, DelegateTask delegateTask) {
        Map<Long, Set<String>> result = Maps.newConcurrentMap();
        String nextApprover = (String) delegateTask.getVariable(BpmnConst.VAR_NEXT_APPROVER);
        log.info("手动选择审批人信息:{}", nextApprover);
        if (!Strings.isNullOrEmpty(nextApprover) && !nextApprover.equals("0")) {
            final List<String> split = StrUtil.split(nextApprover, ',');
            Set<String> approvers = new HashSet(split);
            result.put(0L, approvers);
            return result;
        } else {
            log.info("没有手动设置审批人");
        }
        final String businessKey = delegateTask.getExecution().getProcessInstanceBusinessKey();
        // 取得审批人信息
        final List<ProcessNodeApproverEntity> nodeApprovers =
                processNodeApproverService.findByFlowIdAndNodeId(flowId, nodeId);
        if (CollectionUtil.isEmpty(nodeApprovers)) {
            log.warn("the node {} and billId {} has not approvers!!!", nodeId, businessKey);
            return Collections.emptyMap();
        }
        // 取得各个流程变量
        Map<String, Object> formDataMap;
        formDataMap = (Map<String, Object>) delegateTask.getVariable(BpmnConst.VAR_FORM_DATA);
        if (Objects.isNull(formDataMap)) {
            formDataMap = Maps.newHashMap();
        }
        Map<String, Object> tmp = Maps.newHashMap();
        tmp.putAll(formDataMap);
        final Map<String, Object> formDataMap1 = (Map<String, Object>) delegateTask.getVariable(
                BpmnConst.VAR_AGREE_DATA);
        if (!Objects.isNull(formDataMap1)) {
            for (String s : formDataMap1.keySet()) {
                if (!Objects.isNull(formDataMap1.get(s))) {
                    tmp.put(s, formDataMap1.get(s));
                }
            }
        }
        final String applyEmployeeJSON = (String) delegateTask.getVariable(
                BpmnConst.VAR_BILL_CONTEXT);
        BpmnBillContext billContext = JSON.parseObject(applyEmployeeJSON, BpmnBillContext.class);

        Set<String> employeeApprovers = Sets.newHashSet();

        for (ProcessNodeApproverEntity nodeApprover : nodeApprovers) {
            final String approver = nodeApprover.getApprover();
            if (Strings.isNullOrEmpty(approver)) {
                continue;
            }

            final String express = nodeApprover.getExpress();
            if (!Strings.isNullOrEmpty(express)) {
                final String expressParams = nodeApprover.getExpressParams();

                Map<String, Object> env = Maps.newHashMap();
                if (StringUtils.contains(express, BpmnConst.VAR_FORM_DATA)) {
                    env.put(BpmnConst.VAR_FORM_DATA, tmp);
                }
                if (StringUtils.contains(express, BpmnConst.VAR_APPLY_EMPLOYEE)) {
                    env.put(BpmnConst.VAR_APPLY_EMPLOYEE, String.valueOf(billContext.getId()));
                }
                env.putAll(billContext.toEnvParam(express));
                if (!Strings.isNullOrEmpty(expressParams)) {
                    final Map<String, Object> expressParamMap;
                    expressParamMap = JSON.parseObject(expressParams, FastJsonType.MAP_OBJECT_TR);
                    env.putAll(expressParamMap);
                }
                Boolean conditionResult;
                try {
                    conditionResult = (Boolean) AviatorEvaluator.execute(express, env);
                } catch (Exception e) {
                    log.error("Express exec has error ! " +
                            "express is \n {} \n ---- param is \n {}", express, JSON.toJSON(env));
                    conditionResult = false;
                }
                if (conditionResult) {
                    final List<NodeSubjectVO> nodeSubjectVOS;
                    nodeSubjectVOS = JSON.parseArray(approver, NodeSubjectVO.class);
                    for (NodeSubjectVO nodeSubjectVO : nodeSubjectVOS) {
                        final Set<String> employees;
                        employees = resolveSubject(nodeSubjectVO, billContext, tmp);
                        employeeApprovers.addAll(employees);
                    }
                    result.put(nodeApprover.getId(), employeeApprovers);
                    break;
                }
            } else {
                final List<NodeSubjectVO> nodeSubjectVOS;
                nodeSubjectVOS = JSON.parseArray(approver, NodeSubjectVO.class);
                for (NodeSubjectVO nodeSubjectVO : nodeSubjectVOS) {
                    final Set<String> employees;
                    employees = resolveSubject(nodeSubjectVO, billContext, tmp);
                    employeeApprovers.addAll(employees);
                }
                result.put(nodeApprover.getId(), employeeApprovers);
                break;
            }
        }
        return result;
    }

    /**
     * 解析获取审批人或者抄送人，通过配置规则
     *
     * @param nodeSubject 节点配置信息
     * @param billContext 审批应用上下文数据
     * @return 审批人或者抄送人 员工ID串
     */
    private Set<String> resolveSubject(NodeSubjectVO nodeSubject, BpmnBillContext billContext, Map<String, Object> formDataMap) {

        final int type = nodeSubject.getType();
        switch (type) {
            case SubjectType.APPROVER_ORG: {
                final int hrType = nodeSubject.getHrType();
                switch (hrType) {
                    case SubjectHrType.EMPLOYEE: {
                        // 指定人员
                        return nodeSubject.assignEmployee();
                    }
                    case SubjectHrType.ORGANIZATION: {
                        return assignOrganizationApply(nodeSubject, billContext);
                    }
                    case SubjectHrType.POSITION: {
                        // 指定职位, 是指那种没有被挂接到具体部门中的职位，也就是顶级职位
                        final List<TreeDataVO> positions = nodeSubject.getPositions();
                        // TODO 优化
                        Set<String> employeeIds = Sets.newHashSet();
                        for (TreeDataVO position : positions) {
                            long positionId = firstNonNull(position.getId(), 0L);
                            final Set<String> userIdSet = userCenterlogic.getOrgPositionUser(positionId, loginUserHolder.getBloc());
                            if (CollectionUtil.isNotEmpty(userIdSet)) {
                                employeeIds.addAll(userIdSet);
                            }
                        }
                        return employeeIds;
                    }
                    case SubjectHrType.LEADER: {
                        //部门领导
                        //todo 部门领导解析
                        return Sets.newHashSet(String.valueOf(0L));
                    }
                    default:
                        break;
                }
                break;
            }
            case SubjectType.FORM_FIELD: {
                final FieldVO field = nodeSubject.getField();
                final String widgetName = field.getWidgetName();
                final Object o = formDataMap.get(widgetName);
                final String s = o.toString();
                Set<String> tmpUserIds = Sets.newHashSet();
                if (Strings.isNullOrEmpty(s)) {
                    return Collections.emptySet();
                }
                if (s.indexOf(",") != -1) {
                    final List<String> strings = StrUtil.split(s, ',');
                    tmpUserIds.addAll(new HashSet<>(strings));
                } else if (!s.startsWith("[")) {
                    tmpUserIds.addAll(Sets.newHashSet(s));
                } else {
                    final List<String> strings = JSON.parseArray(s, String.class);
                    tmpUserIds.addAll(new HashSet<>(strings));
                }
                Set<String> userIds = Sets.newHashSet();
                tmpUserIds.forEach(a -> {
                    if (a.indexOf(".") != -1) {
                        a = StrUtil.split(a, '.').get(0);
                    }
                    userIds.add(a);
                });
                return userIds;
            }
            default:
                break;
        }
        return Collections.emptySet();
    }

    private Set<String> assignOrganizationApply(NodeSubjectVO nodeSubject, BpmnBillContext applyEmployee) {
        // 申请人部门
        final int orgType = nodeSubject.getOrgType();
        switch (orgType) {
            case SubjectOrgType.ORG_LEADER: {
                // 部门领导
                //todo 部门领导
                return Sets.newHashSet(String.valueOf(0L));
            }
            case SubjectOrgType.ORG_POSITION: {
                // 部门职位
                final String orgId = applyEmployee.getOrg().getCode();
                final List<TreeDataVO> positions = nodeSubject.getPositions();
                // TODO 优化
                Set<String> employeeIds = Sets.newHashSet();
                for (TreeDataVO position : positions) {
                    long positionId = firstNonNull(position.getId(), 0L);
                    final Set<String> userIdsSet = userCenterlogic.getOrgPositionUser(positionId, orgId);
                    if (CollectionUtil.isNotEmpty(userIdsSet)) {
                        employeeIds.addAll(userIdsSet);
                    }
                }
                return employeeIds;
            }
            default:
                break;
        }
        return Collections.emptySet();
    }
}

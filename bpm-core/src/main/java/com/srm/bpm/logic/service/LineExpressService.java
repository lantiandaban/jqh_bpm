

package com.srm.bpm.logic.service;

import com.google.common.base.MoreObjects;
import com.google.common.base.Strings;
import com.google.common.collect.Maps;
import com.google.common.primitives.Longs;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.googlecode.aviator.AviatorEvaluator;
import com.srm.bpm.infra.entity.ProcessNodeConnectionEntity;
import com.srm.bpm.infra.service.ProcessNodeConnectionService;
import com.srm.bpm.logic.constant.BillAction;
import com.srm.bpm.logic.context.BpmnBillContext;
import com.srm.bpm.logic.constant.BpmnConst;
import com.srm.bpm.logic.constant.FastJsonType;

import org.activiti.engine.delegate.DelegateExecution;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Objects;

import cn.hutool.core.util.NumberUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * <p> 节点表达式</p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Service(value = LineExpressService.LINE_EXPRESS)
@RequiredArgsConstructor
@Slf4j
public class LineExpressService {

    static final String LINE_EXPRESS = "lineExpr";

    private final ProcessNodeConnectionService nodeConnectionService;


    /**
     * 执行表达式
     *
     * @param execution   执行的额外信息
     * @param processId   业务流程主键
     * @param nodeId      节点ID
     * @param proposer    发起人JSON
     * @param approver    审批人JSON
     * @param formDataMap 表单数据
     * @param action      请求
     * @return 是否成功
     */
    public boolean invoke(
            DelegateExecution execution,
            String processId, String nodeId,
            String proposer, String approver,
            Map<String, Object> formDataMap,
            String action
    ) {
        if (Strings.isNullOrEmpty(processId)) {
            log.warn("the node condition express processId is null! please check!");
            return false;
        }
        if (Strings.isNullOrEmpty(nodeId)) {
            log.warn("the node condition express nodeId is null! please check!");
            return false;
        }
        long lProcessId = MoreObjects.firstNonNull(Longs.tryParse(processId), 0L);
        if (lProcessId <= 0) {
            log.warn("the node condition express processId is zero! please check!");
            return false;
        }
        if (!StringUtils.equals(action, BillAction.agree.name())
                && !StringUtils.equals(action, BillAction.submit.name())) {
            // 不是审批提交和同意的 都走其他连线
            log.warn("The node action is not agree, return false;");
            return false;
        }
        long flowProcessId = MoreObjects.firstNonNull(Longs.tryParse(processId), 0L);
        final ProcessNodeConnectionEntity connection =
                nodeConnectionService.getOne(Wrappers.lambdaQuery(ProcessNodeConnectionEntity.class).eq(ProcessNodeConnectionEntity::getProcessId, flowProcessId)
                        .eq(ProcessNodeConnectionEntity::getNodeId, nodeId));
        if (!Objects.isNull(connection)) {
            String express = connection.getExpress();
            if (Strings.isNullOrEmpty(express)) {
                return true;
            }
            String expressParams = connection.getExpressParams();
            if (log.isDebugEnabled()) {
                log.debug("The line node express is \n **** {} \n param is \n *** {} ", express, expressParams);
            }

            BpmnBillContext billContext = JSON.parseObject(proposer, BpmnBillContext.class);

            Map<String, Object> env = Maps.newHashMap();
            for (String key : formDataMap.keySet()) {
                if (Objects.isNull(formDataMap.get(key))) {
                    continue;
                }
                if (NumberUtil.isNumber(formDataMap.get(key).toString())) {
                    formDataMap.put(key, NumberUtil.toBigDecimal(formDataMap.get(key).toString()));
                }
            }
            if (StringUtils.contains(express, BpmnConst.VAR_FORM_DATA)) {
                env.put(BpmnConst.VAR_FORM_DATA, formDataMap);
            }
            env.putAll(billContext.toEnvParam(express));
            if (!Strings.isNullOrEmpty(expressParams)) {
                final Map<String, Object> paramMap = JSON.parseObject(expressParams, FastJsonType.MAP_OBJECT_TR);
                env.putAll(paramMap);
            }
            env.put(BpmnConst.VAR_APPLY_EMPLOYEE, String.valueOf(billContext.getId()));
            final boolean pass;
            pass = BooleanUtils.toBoolean((Boolean) AviatorEvaluator.execute(express, env));
            if (log.isDebugEnabled()) {
                log.debug("line express resolve param is " +
                                "\n ------ processId: {} " +
                                "\n ------ nodeId: {}" +
                                "\n ------ proposer: {}" +
                                "\n ------ approver: {}" +
                                "\n ------ action: {}" +
                                "\n ------ formData: {}",
                        processId, nodeId,
                        proposer, approver,
                        action,
                        JSON.toJSONString(formDataMap));
                log.debug("The line node {} [{}] parse result is {} \n --- the express is {} " +
                                "\n --- the express params is {} ",
                        nodeId, "", pass ? "pass" : "no pass", express, expressParams);
            }
            return pass;

        } else {
            if (log.isDebugEnabled()) {

                log.debug("line express resolve param is " +
                                "\n ------ processId: {} " +
                                "\n ------ nodeId: {}" +
                                "\n ------ proposer: {}" +
                                "\n ------ approver: {}" +
                                "\n ------ action: {}" +
                                "\n ------ formData: {}", processId, nodeId, proposer, approver, action,
                        JSON.toJSONString(formDataMap));
            }
            // 没有节点连线配置，直接扭转
            return true;
        }

    }
}

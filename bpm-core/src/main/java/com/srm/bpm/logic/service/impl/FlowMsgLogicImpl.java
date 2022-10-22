

package com.srm.bpm.logic.service.impl;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

import com.srm.bpm.infra.entity.BillTaskEntity;
import com.srm.bpm.infra.entity.ToaBillEntity;
import com.srm.bpm.infra.service.ToaBillService;
import com.srm.bpm.logic.constant.BillTaskStatus;
import com.srm.bpm.logic.constant.BillTaskType;
import com.srm.bpm.logic.constant.StringPool;
import com.srm.bpm.logic.dto.FlowMsgDTO;
import com.srm.bpm.logic.service.FlowMsgLogic;
import com.srm.bpm.logic.service.PushMsgLogic;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import cn.hutool.core.collection.CollectionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@RequiredArgsConstructor
@Service
@Slf4j
public class FlowMsgLogicImpl implements FlowMsgLogic {
    private final ToaBillService billService;
    private final PushMsgLogic pushMsgLogic;

    @Override
    public void sendMsg(List<BillTaskEntity> billTaskEntities) {
        if (CollectionUtil.isNotEmpty(billTaskEntities)) {
            final BillTaskEntity billTaskEntity = billTaskEntities.get(0);
            final Long billId = billTaskEntity.getBillId();
            final Optional<ToaBillEntity> billOpt = billService.unique(billId);
            if (billOpt.isPresent()) {
                final ToaBillEntity toaBillEntity = billOpt.get();
                final String title = toaBillEntity.getTitle();
                final String createUserCode = toaBillEntity.getSender();
                final List<FlowMsgDTO> allMsg = Lists.newArrayList();
                for (BillTaskEntity taskEntity : billTaskEntities) {
                    final Integer taskType = taskEntity.getTaskType();
                    final BillTaskType billTaskType = BillTaskType.forValue(taskType);
                    List<FlowMsgDTO> flowMsgDTOS = Lists.newArrayList();
                    switch (billTaskType) {
                        case DEFAULT:
                            flowMsgDTOS = defaultNodeType(taskEntity, createUserCode, title);
                            break;
                        case SKIP:
                            flowMsgDTOS = skipNodeType(taskEntity, createUserCode, title);
                            break;
                        case ENDORSE:
                            flowMsgDTOS = endorseNodeType(taskEntity, createUserCode, title);
                            break;
                        case TRANSFER:
                            flowMsgDTOS = transferNodeType(taskEntity, createUserCode, title);
                            break;
                        case TURN:
                            flowMsgDTOS = turnNodeType(taskEntity, createUserCode, title);
                            break;
                    }
                    allMsg.addAll(flowMsgDTOS);
                }
                log.debug("推送的消息是:{}", allMsg);
//                TODO 注释消息
//                pushMsgLogic.push(allMsg);
            }
        }
    }

    @Override
    public void sendMsg(List<BillTaskEntity> billTaskEntities, boolean syncFlag) {
        this.sendMsg(billTaskEntities);
    }

    private List<FlowMsgDTO> turnNodeType(BillTaskEntity taskEntity, String createUser, String title) {
        final Integer nodeStatus = taskEntity.getNodeStatus();
        final BillTaskStatus billTaskStatus = BillTaskStatus.valueTo(nodeStatus);
        Set<String> receivers = Sets.newConcurrentHashSet();
        final String approver = taskEntity.getUserCode();
        final String content = "移交" + getContent(createUser, billTaskStatus, receivers, approver);
        List<FlowMsgDTO> msgDTOS = Lists.newArrayListWithExpectedSize(receivers.size());
        receivers.forEach(a -> {
            FlowMsgDTO flowMsgDTO = FlowMsgDTO.build(a, createUser, content, title, taskEntity.getNodeName(), taskEntity.getOpinion());
            msgDTOS.add(flowMsgDTO);
        });
        return msgDTOS;
    }

    private List<FlowMsgDTO> transferNodeType(BillTaskEntity taskEntity, String createUser, String title) {
        final Integer nodeStatus = taskEntity.getNodeStatus();
        final BillTaskStatus billTaskStatus = BillTaskStatus.valueTo(nodeStatus);
        Set<String> receivers = Sets.newConcurrentHashSet();
        final String approver = taskEntity.getUserCode();
        final String content = "转办" + getContent(createUser, billTaskStatus, receivers, approver);
        List<FlowMsgDTO> msgDTOS = Lists.newArrayListWithExpectedSize(receivers.size());
        receivers.forEach(a -> {
            FlowMsgDTO flowMsgDTO = FlowMsgDTO.build(a, createUser, content, title, taskEntity.getNodeName(), taskEntity.getOpinion());
            msgDTOS.add(flowMsgDTO);
        });
        return msgDTOS;
    }

    private List<FlowMsgDTO> endorseNodeType(BillTaskEntity taskEntity, String createUser, String title) {
        final Integer nodeStatus = taskEntity.getNodeStatus();
        final BillTaskStatus billTaskStatus = BillTaskStatus.valueTo(nodeStatus);
        Set<String> receivers = Sets.newConcurrentHashSet();
        final String approver = taskEntity.getUserCode();
        final String content = "加签" + getContent(createUser, billTaskStatus, receivers, approver);
        List<FlowMsgDTO> msgDTOS = Lists.newArrayListWithExpectedSize(receivers.size());
        receivers.forEach(a -> {
            FlowMsgDTO flowMsgDTO = FlowMsgDTO.build(a, createUser, content, title, taskEntity.getNodeName(), taskEntity.getOpinion());
            msgDTOS.add(flowMsgDTO);
        });
        return msgDTOS;
    }

    private List<FlowMsgDTO> skipNodeType(BillTaskEntity taskEntity, String createUser, String title) {
        final Integer nodeStatus = taskEntity.getNodeStatus();
        final BillTaskStatus billTaskStatus = BillTaskStatus.valueTo(nodeStatus);
        Set<String> receivers = Sets.newConcurrentHashSet();
        final String approver = taskEntity.getUserCode();
        final String content = getContent(createUser, billTaskStatus, receivers, approver);
        List<FlowMsgDTO> msgDTOS = Lists.newArrayListWithExpectedSize(receivers.size());
        receivers.forEach(a -> {
            if (!a.equals(StringPool.ZERO)) {
                FlowMsgDTO flowMsgDTO = FlowMsgDTO.build(a, createUser, content, title, taskEntity.getNodeName(), taskEntity.getOpinion());
                msgDTOS.add(flowMsgDTO);
            }
        });
        return msgDTOS;
    }

    private List<FlowMsgDTO> defaultNodeType(BillTaskEntity taskEntity, String createUser, String title) {
        final Integer nodeStatus = taskEntity.getNodeStatus();
        final BillTaskStatus billTaskStatus = BillTaskStatus.valueTo(nodeStatus);
        Set<String> receivers = Sets.newConcurrentHashSet();
        final String approver = taskEntity.getUserCode();
        final String content = getContent(createUser, billTaskStatus, receivers, approver);
        List<FlowMsgDTO> msgDTOS = Lists.newArrayListWithExpectedSize(receivers.size());
        receivers.forEach(a -> {
            FlowMsgDTO flowMsgDTO = FlowMsgDTO.build(a, createUser, content, title, taskEntity.getNodeName(), taskEntity.getOpinion());
            msgDTOS.add(flowMsgDTO);
        });
        return msgDTOS;
    }

    @NotNull
    private String getContent(String createUser, BillTaskStatus billTaskStatus, Set<String> receivers, String approver) {
        final String content;
        switch (billTaskStatus) {
            case APPROVAL:
                content = "审批中";
                receivers.add(approver);
                break;
            case SKIP:
                content = "自动跳过";
                break;
            case ENDORSE:
                content = "加签";
                receivers.add(approver);
                break;
            case AGREE:
                content = "已同意";
                receivers.add(approver);
                receivers.add(createUser);
                break;
            case REFUSE:
                content = "已拒绝";
                receivers.add(approver);
                receivers.add(createUser);
                break;
            case REPULSE:
                content = "已退回";
                receivers.add(approver);
                receivers.add(createUser);
                break;
            case TRANSFER:
                content = "已转办";
                receivers.add(approver);
                break;
            case TURN:
                content = "已移交";
                receivers.add(approver);
                break;
            case REFUSE_FILL_IN:
                content = "重新填写";
                receivers.add(createUser);
                break;
            default:
                content = "";
                break;
        }
        return content;
    }
}

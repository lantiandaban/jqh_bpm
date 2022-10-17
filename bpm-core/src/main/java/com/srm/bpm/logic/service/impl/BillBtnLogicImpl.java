

package com.srm.bpm.logic.service.impl;

import com.google.common.base.MoreObjects;
import com.google.common.base.Optional;
import com.google.common.base.Strings;
import com.google.common.collect.Lists;

import com.srm.bpm.infra.entity.BillCcPersonEntity;
import com.srm.bpm.infra.entity.BillTaskEntity;
import com.srm.bpm.infra.entity.FormExtensionsEntity;
import com.srm.bpm.infra.entity.FormSettingEntity;
import com.srm.bpm.infra.entity.ProcessNodeExtendEntity;
import com.srm.bpm.infra.entity.ToaBillEntity;
import com.srm.bpm.infra.po.ProcessDetailPO;
import com.srm.bpm.infra.service.BillCcPersonService;
import com.srm.bpm.infra.service.FormExpressionService;
import com.srm.bpm.infra.service.FormSettingService;
import com.srm.bpm.infra.service.ProcessNodeExtendService;
import com.srm.bpm.infra.service.ToaProcessService;
import com.srm.bpm.logic.constant.BillAction;
import com.srm.bpm.logic.constant.BillStatus;
import com.srm.bpm.logic.constant.BillTaskStatus;
import com.srm.bpm.logic.constant.NodeLinkType;
import com.srm.bpm.logic.dto.ProcessDetailDTO;
import com.srm.bpm.logic.error.BillCode;
import com.srm.bpm.logic.service.BillBtnLogic;
import com.srm.bpm.logic.constant.BillBtnConst;
import com.srm.common.data.exception.RbException;

import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.FlowElement;
import org.activiti.bpmn.model.SequenceFlow;
import org.activiti.bpmn.model.UserTask;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.ProcessDefinition;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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
public class BillBtnLogicImpl implements BillBtnLogic {
    private final FormExpressionService formExpressionService;
    private final ToaProcessService processService;
    private final RepositoryService repositoryService;
    private final ProcessNodeExtendService nodeExtendService;
    private final BillCcPersonService billCcPersonService;
    private final FormSettingService formSettingService;

    /**
     * 根据业务流程 获取 在创建 业务审批单的时候的按钮权限
     *
     * @param process 业务流程
     * @return 审批按钮组
     */
    @Override
    public List<String> findBtnsOnCreateBill(ProcessDetailDTO process) {
        final List<String> btns = Lists.newArrayList(BillBtnConst.BTN_SUBMIT, BillBtnConst.BTN_SAVE);
//        if (process.isDetailFieldFlag()) {
//            btns.add(BillBtnConst.BTN_DETAIL_IMPORT);
//        }
//        long processId = process.getId();
//        final List<String> featureBtns = findFormExtensions(processId);
//        if (CollectionUtil.isNotEmpty(featureBtns)) {
//            btns.addAll(featureBtns);
//        }

        return btns;
    }

    /**
     * 根据审批单和审批任务的相关状态来获取审批按钮
     *
     * @param userCode 用户编码
     * @param bill     审批单
     * @param billTask 任务任务
     * @return 审批按钮组
     */
    @Override
    public List<String> findBtnsOnTaskAction(String userCode, ToaBillEntity bill, BillTaskEntity billTask) {
        final String sender = bill.getSender();
        if (sender.equals(userCode)) {
            return this.findBtnsOnSelfApproval(bill, billTask);
        } else {
            return this.findBtnsOnCanApproval(bill, billTask);
        }
    }

    /**
     * 获取当一个员工可以对某个审批单存在审批任务的时候，获取审批按钮组
     *
     * @param bill     审批单
     * @param billTask 审批任务
     * @return 审批按钮组
     */
    private List<String> findBtnsOnCanApproval(ToaBillEntity bill, BillTaskEntity billTask) {
        final int status = MoreObjects.firstNonNull(bill.getStatus(), -1);
        BillStatus billStatus = BillStatus.valueTo(status);
        final long processId = MoreObjects.firstNonNull(bill.getProcessId(), 0L);
        final int billTaskNodeStatus = billTask.getNodeStatus();
        BillTaskStatus billTaskStatus = BillTaskStatus.valueTo(billTaskNodeStatus);

        List<String> btns;
        // 不是自己的， 则表示可以进行审批
        switch (billStatus) {
            case DRAFTS:
                // 这个时候，还是草稿箱，说明看到的有问题，所以没有任何操作
                throw new RbException(BillCode.CAN_NOT_SEE);
            case APPROVAL:
                switch (billTaskStatus) {
                    case FILL_IN:
                    case REFUSE_FILL_IN:
                    case APPLY_CANCEL:
                        // 你能审批，还能填写，还能申请撤销，这绝对有问题，错误（注意此段逻辑已经排除了自己发起的）
                        throw new RbException(BillCode.CAN_NOT_SEE);
                    case AGREE:
                    case REFUSE:
                    case OTHER_APPROVAL:
                    case CANCEL:
                    case REPULSE:
                        // 如果是已经审批过或者已经撤销了，可以碱性查看轨迹等
                        btns = Lists.newArrayList(BillBtnConst.BTN_TRACK);
                        break;
                    case APPROVAL:
                        // 好了，在这里，表示 这个人真的能审批了
                        // 首先 找下审批节点配置把
                        final String taskNodeKey = billTask.getTaskNodeKey();
                        final Optional<ProcessNodeExtendEntity> nodeExtendOpt;
                        nodeExtendOpt = nodeExtendService.findByNodeIdAndProcessId(processId, taskNodeKey);
                        if (nodeExtendOpt.isPresent()) {
                            ProcessNodeExtendEntity nodeExtend = nodeExtendOpt.get();
                            final String linkType = nodeExtend.getLinkType();
                            NodeLinkType nodeLinkType = NodeLinkType.valueOf(linkType);
                            switch (nodeLinkType) {
                                case approvl:
                                    btns = Lists.newArrayList(
                                            BillBtnConst.BTN_AGREE, BillBtnConst.BTN_TRANSFER, BillBtnConst.BTN_BACK);
                                    boolean isRefuseNode = nextNodeHasRefuse(processId, nodeExtend);
                                    if (isRefuseNode) {
                                        btns.add(1, BillBtnConst.BTN_REFUSE);
                                    }
                                    if (nodeExtend.getCountersignFlag().compareTo(1) == 0) {
                                        btns.add(BillBtnConst.BTN_ENDORSE);
                                    }
                                    btns.add(BillBtnConst.BTN_TRACK);
                                    break;
                                case submit:
                                    btns = Lists.newArrayList(
                                            BillBtnConst.BTN_PRESENT, BillBtnConst.BTN_TRACK);
                                    break;
                                case create:
                                    // 这个是创建节点，由于排除了我发起的，这里肯定不对。。。不能看
                                    log.error("When the examination and approval to create nodes, should not ah. the task id is {}", billTask.getId());
                                    throw new RbException(BillCode.CAN_NOT_SEE);
                                case archive:
                                    btns = Lists.newArrayList(BillBtnConst.BTN_ARCHIVED, BillBtnConst.BTN_TRACK);
                                    break;
                                default:
                                    // 我去，节点类型呢。。。。
                                    log.error("The corresponding approval task node operation type does not exist. the task id is {}", billTask.getId());
                                    throw new RbException(BillCode.CAN_NOT_SEE);
                            }
                        } else {
                            log.error("Cannot find the approval task corresponding node. the task id is {}", billTask.getId());
                            // 好的 找不了节点，那只能不给你看审批单了
                            throw new RbException(BillCode.CAN_NOT_SEE);
                        }
                        break;
                    case ARCHIVED:
                        // 归档中， 这里是你来归档，应该不会出现其他逻辑了
                        btns = Lists.newArrayList(BillBtnConst.BTN_ARCHIVED, BillBtnConst.BTN_TRACK);
                        break;
                    case ENDORSE:
                        // 加签中只能看轨迹
                        btns = Lists.newArrayList(BillBtnConst.BTN_TRACK);
                        break;
                    default:
                        // 这是啥状态的。肯定无法查看
                        log.error("the bill task's status has not found. the task id is {}", billTask.getId());
                        throw new RbException(BillCode.CAN_NOT_SEE);
                }
                break;
            case ARCHIVE:
                switch (billTaskStatus) {
                    case APPROVAL:
                        // 待归档显示
                        btns = Lists.newArrayList(BillBtnConst.BTN_ARCHIVED, BillBtnConst.BTN_TRACK);
                        break;
                    default:
                        // 如果是已经审批过了，则按钮也不需要显示审批等操作
                        btns = Lists.newArrayList(BillBtnConst.BTN_TRACK);
                        break;
                }
                break;
            case CANCEL:
            case COMPLETE:
            case REFUSE:

                switch (billTaskStatus) {
                    case FILL_IN:
                    case REFUSE_FILL_IN:
                    case APPLY_CANCEL:
                        // 你能审批，还能填写，还能申请撤销，这绝对有问题，错误（注意此段逻辑已经排除了自己发起的）
                        throw new RbException(BillCode.CAN_NOT_SEE);
                    case AGREE:
                    case REFUSE:
                    case OTHER_APPROVAL:
                    case CANCEL:
                        // 如果是已经审批过或者已经撤销了，可以碱性查看轨迹等
                        btns = Lists.newArrayList(BillBtnConst.BTN_TRACK);
                        break;
                    case APPROVAL:
                        // 好了，在这里，表示 这个人真的能审批了
                        // 首先 找下审批节点配置把
                        final String taskNodeKey = billTask.getTaskNodeKey();
                        final Optional<ProcessNodeExtendEntity> nodeExtendOpt;
                        nodeExtendOpt = nodeExtendService.findByNodeIdAndProcessId(processId, taskNodeKey);
                        if (nodeExtendOpt.isPresent()) {
                            ProcessNodeExtendEntity nodeExtend = nodeExtendOpt.get();
                            final String linkType = nodeExtend.getLinkType();
                            NodeLinkType nodeLinkType = NodeLinkType.valueOf(linkType);
                            switch (nodeLinkType) {
                                case approvl:
                                    btns = Lists.newArrayList(BillBtnConst.BTN_AGREE);
                                    boolean isRefuseNode = nextNodeHasRefuse(processId, nodeExtend);
                                    if (isRefuseNode) {
                                        btns.add(1, BillBtnConst.BTN_REFUSE);
                                    }
                                    if (nodeExtend.getCountersignFlag().compareTo(1) == 0) {
                                        btns.add(BillBtnConst.BTN_ENDORSE);
                                    }
                                    btns.add(BillBtnConst.BTN_TRANSFER);
                                    btns.add(BillBtnConst.BTN_TRACK);
                                    break;
                                case submit:
                                    btns = Lists.newArrayList(
                                            BillBtnConst.BTN_PRESENT, BillBtnConst.BTN_TRACK);
                                    break;
                                case create:
                                    // 这个是创建节点，由于排除了我发起的，这里肯定不对。。。不能看
                                    log.error("When the examination and approval to create nodes, should not ah. the task id is {}", billTask.getId());
                                    throw new RbException(BillCode.CAN_NOT_SEE);
                                case archive:
                                    btns = Lists.newArrayList(BillBtnConst.BTN_ARCHIVED, BillBtnConst.BTN_TRACK);
                                    break;
                                default:
                                    // 我去，节点类型呢。。。。
                                    log.error("The corresponding approval task node operation type does not exist. the task id is {}", billTask.getId());
                                    throw new RbException(BillCode.CAN_NOT_SEE);
                            }
                        } else {
                            log.error("Cannot find the approval task corresponding node. the task id is {}", billTask.getId());
                            // 好的 找不了节点，那只能不给你看审批单了
                            throw new RbException(BillCode.CAN_NOT_SEE);
                        }
                        break;
                    case ARCHIVED:
                        // 归档中， 这里是你来归档，应该不会出现其他逻辑了
                        btns = Lists.newArrayList(BillBtnConst.BTN_ARCHIVED, BillBtnConst.BTN_TRACK);
                        break;
                    case ENDORSE:
                        // 加签中只能看轨迹
                        btns = Lists.newArrayList(BillBtnConst.BTN_TRACK);
                        break;
                    default:
                        // 这是啥状态的。肯定无法查看
                        log.error("the bill task's status has not found. the task id is {}", billTask.getId());
                        throw new RbException(BillCode.CAN_NOT_SEE);
                }

                break;
            default:
                log.error("Error state approval paper. the bill id is {}", bill.getId());
                throw new RbException(BillCode.CAN_NOT_SEE);
        }
        final boolean printTemplate = hasPrintTemplate(processId);
        if (printTemplate) {
            btns.add(BillBtnConst.BTN_PRINT);
        }
        return btns;
    }

    /**
     * 当一个审批单 是自己发起的，并且当前任务是自己审批或者归档或者确认的时候，获取审批按钮组
     *
     * @param bill     审批单
     * @param billTask 审批任务
     * @return 审批按钮组
     */
    private List<String> findBtnsOnSelfApproval(ToaBillEntity bill, BillTaskEntity billTask) {
        final int status = MoreObjects.firstNonNull(bill.getStatus(), -1);
        BillStatus billStatus = BillStatus.valueTo(status);
        final long processId = MoreObjects.firstNonNull(bill.getProcessId(), 0L);
        List<String> btns;
        final int billTaskNodeStatus = billTask.getNodeStatus();
        BillTaskStatus billTaskStatus = BillTaskStatus.valueTo(billTaskNodeStatus);
        switch (billTaskStatus) {
            case FILL_IN:
                // 填写， 如果是我发起的并且当前的任务状态是发起，则可以提交
                switch (billStatus) {
                    case APPROVAL:
                        // 如果单子还在审批中，则显示撤销按钮
                        btns = Lists.newArrayList(BillBtnConst.BTN_CANCEL, BillBtnConst.BTN_TRACK);
                        break;
                    case DRAFTS:
                        btns = Lists.newArrayList(BillBtnConst.BTN_SUBMIT, BillBtnConst.BTN_SAVE, BillBtnConst.BTN_TRACK);
                        break;
                    case ARCHIVE:
                    case COMPLETE:
                        btns = Lists.newArrayList(BillBtnConst.BTN_TRACK);
                        break;
                    case REFUSE:
                        btns = Lists.newArrayList(BillBtnConst.BTN_TRACK);
                        break;
                    case CANCEL:
                        btns = Lists.newArrayList(BillBtnConst.BTN_SUBMIT, BillBtnConst.BTN_TRACK);
                        break;
                    default:
                        throw new RbException(BillCode.CAN_NOT_SEE);
                }
                break;
            case REFUSE_FILL_IN:
                switch (billStatus) {
                    case REPULSE:
                        btns = Lists.newArrayList(BillBtnConst.BTN_SUBMIT, BillBtnConst.BTN_TRACK);
                        break;
                    case APPROVAL:
                        btns = Lists.newArrayList(BillBtnConst.BTN_CANCEL, BillBtnConst.BTN_TRACK);
                        break;
                    case REFUSE:
                        // 重新填写
                        btns = this.findBtnsOnReFullIn(processId);
                        break;
                    default:
                        btns = Lists.newArrayList(BillBtnConst.BTN_TRACK);
                        break;
                }
                break;
            case APPROVAL:
                // 我审批的
                switch (billStatus) {
                    case APPROVAL:
                        btns = this.findBtnsOnSelfApproval(billTask, processId);
                        break;
                    case ARCHIVE:
                        // 待归档
                        btns = Lists.newArrayList(BillBtnConst.BTN_ARCHIVED, BillBtnConst.BTN_TRACK);
                        break;
                    default:
                        btns = Lists.newArrayList(BillBtnConst.BTN_TRACK);
                        break;
                }
                break;
            case REFUSE:
            case CANCEL:
                // 如果单子为已拒绝，则需要显示重新提交按钮
                btns = this.findBtnsOnReFullIn(processId);
                break;
            case AGREE:
            case OTHER_APPROVAL:
                // 已同意或者已拒绝,因为是我自己发其的
                switch (billStatus) {
                    case APPROVAL:
                        // 如果单子还在审批中， 则可以显示撤销
                        btns = Lists.newArrayList(BillBtnConst.BTN_CANCEL, BillBtnConst.BTN_TRACK);
                        break;
                    default:
                        btns = Lists.newArrayList(BillBtnConst.BTN_TRACK);
                        break;

                }
                break;
            case ARCHIVED:
                // 我自己归档的审批单（同时是自己发起的）
                switch (billStatus) {
                    case APPROVAL:
                        // 还在审批
                        btns = Lists.newArrayList(BillBtnConst.BTN_ARCHIVED, BillBtnConst.BTN_TRACK);
                        break;
                    default:
                        btns = Lists.newArrayList(BillBtnConst.BTN_TRACK);
                        break;
                }
                break;
            case APPLY_CANCEL:
                // 我自己发起的并且我已经申请撤销了
                switch (billStatus) {
                    case APPROVAL:
                        // 还在审批,应该不会出现这个逻辑，如果出现了 已经申请撤销了 然后还在审批中，是存在问题的。
                        // 记录在此
                        btns = Lists.newArrayList(BillBtnConst.BTN_TRACK);
                        break;
                    default:
                        btns = Lists.newArrayList(BillBtnConst.BTN_SUBMIT, BillBtnConst.BTN_TRACK);
                        break;
                }
                break;
            case TURN:
            case TRANSFER:
            case ENDORSE:
                btns = Lists.newArrayList(BillBtnConst.BTN_TRACK);
                break;
            default:
                btns = Collections.emptyList();
                break;
        }
        final boolean printTemplate = hasPrintTemplate(processId);
        if (printTemplate) {
            btns.add(BillBtnConst.BTN_PRINT);
        }
        return btns;
    }

    private List<String> findBtnsOnSelfApproval(BillTaskEntity billTask, long processId) {
        // 如果当前任务的节点正好是新建节点，则显示提交等按钮
        final String taskId = billTask.getTaskId();
        final Optional<ProcessNodeExtendEntity> nodeExtendOpt = nodeExtendService.findByTaskId(taskId);
        if (nodeExtendOpt.isPresent()) {
            final ProcessNodeExtendEntity nodeExtend = nodeExtendOpt.get();

            final String linkType = nodeExtend.getLinkType();
            NodeLinkType nodeLinkType = NodeLinkType.valueOf(linkType);
            switch (nodeLinkType) {
                case create:
                    return this.findBtnsOnReFullIn(processId);
                case archive:
                    return Lists.newArrayList(BillBtnConst.BTN_ARCHIVED, BillBtnConst.BTN_TRACK);
                case approvl:
                    final boolean hasRefuse = nextNodeHasRefuse(processId, nodeExtend);
                    final List<String> btns = Lists.newArrayList(BillBtnConst.BTN_CANCEL, BillBtnConst.BTN_AGREE, BillBtnConst.BTN_BACK);
                    if (hasRefuse) {
                        // 正式自己的待我审批，则显示，审批同意等按钮
                        btns.add(2, BillBtnConst.BTN_REFUSE);
                    }
                    if (!Objects.isNull(nodeExtend.getCountersignFlag()) && nodeExtend.getCountersignFlag().compareTo(1) == 0) {
                        btns.add(BillBtnConst.BTN_ENDORSE);
                    }
                    btns.add(BillBtnConst.BTN_TRANSFER);
                    btns.add(BillBtnConst.BTN_TRACK);
                    final boolean printTemplate = hasPrintTemplate(processId);
                    if (printTemplate) {
                        btns.add(BillBtnConst.BTN_PRINT);
                    }
                    return btns;
                case submit:
                    return Lists.newArrayList(BillBtnConst.BTN_PRESENT, BillBtnConst.BTN_TRACK);
                default:
                    log.error("I launched the approval for examination and approval of the node type error. the bill task id is {}", billTask.getId());
                    throw new RbException(BillCode.CAN_NOT_SEE);
            }
        } else {
            throw new RbException(BillCode.CAN_NOT_SEE);
        }
    }

    /**
     * 判断像个节点是否存在拒绝节点
     *
     * @param processId  审批业务流程id
     * @param nodeExtend 当前节点
     * @return 是否包含 拒绝操作， true 包含 false 不包含
     */
    private boolean nextNodeHasRefuse(long processId, ProcessNodeExtendEntity nodeExtend) {
        String flowId = "Process_" + processId;
        final ProcessDefinition processDefinition = repositoryService
                .createProcessDefinitionQuery()
                .processDefinitionKey(flowId)
                .latestVersion() // 获取最后一个版本
                .singleResult();
        final BpmnModel bpmnModel = repositoryService.getBpmnModel(processDefinition.getId());
        final FlowElement flowElement = bpmnModel.getFlowElement(nodeExtend.getNodeId());
        boolean isRefuseNode = false;
        if (flowElement != null) {
            if (flowElement instanceof UserTask) {
                final UserTask userTask = (UserTask) flowElement;
                final List<SequenceFlow> outgoingFlows = userTask.getOutgoingFlows();
                for (SequenceFlow outgoingFlow : outgoingFlows) {
                    final String outgoingFlowId = outgoingFlow.getId();
                    final Optional<ProcessNodeExtendEntity> targetNode;
                    targetNode = nodeExtendService.findByFlowIdAndNodeId(outgoingFlowId, flowId);
                    if (targetNode.isPresent()) {
                        ProcessNodeExtendEntity targetExtend = targetNode.get();
                        final String nodeAction = targetExtend.getNodeAction();
                        isRefuseNode = StringUtils.equals(nodeAction, BillAction.refuse.toString());
                        if (isRefuseNode) {
                            break;
                        }
                    }


                }
            }
        }
        return isRefuseNode;
    }

    @Override
    @Transactional(readOnly = true, rollbackFor = Exception.class)
    public List<String> findBtnsOnReFullIn(long processId) {
        final ProcessDetailPO process = this.processService.findDetailById(processId);
        final List<String> btns = Lists.newArrayList(BillBtnConst.BTN_SUBMIT);
//        if (process.isDetailFieldFlag()) {
//            btns.add(BillBtnConst.BTN_DETAIL_IMPORT);
//        }
        final List<String> featureBtns = findFormExtensions(processId);
        if (CollectionUtil.isNotEmpty(featureBtns)) {
            btns.addAll(featureBtns);
        }
        return btns;
    }

    /**
     * 当没有审批任务，但是可以查看这个审批单的时候，获取他的审批按钮组
     *
     * @param userCode 员工ID
     * @param bill     审批单
     * @return 审批按钮组
     */
    @Override
    public List<String> findBtnsOnViewBill(String userCode, ToaBillEntity bill) {
        String sender = bill.getSender();
        final int status = MoreObjects.firstNonNull(bill.getStatus(), -1);
        BillStatus billStatus = BillStatus.valueTo(status);
        if (sender.equals(userCode)) {

            final long processId = MoreObjects.firstNonNull(bill.getProcessId(), 0L);
            // 如果是自己的且不属于自己审批的审批单， 则按钮为 撤销
            boolean printTmplate = hasPrintTemplate(processId);
            List<String> btns;
            switch (billStatus) {
                case DRAFTS:
                    btns = Lists.newArrayList(BillBtnConst.BTN_SUBMIT, BillBtnConst.BTN_SAVE);
                    break;
                case APPROVAL:
                    btns = Lists.newArrayList(BillBtnConst.BTN_CANCEL, BillBtnConst.BTN_TRACK);
                    break;
                case ARCHIVE:
                case COMPLETE:
                    // 归档中和已完成或者已取消 都只能查看模式
                    btns = Lists.newArrayList(BillBtnConst.BTN_TRACK);
                    break;
                case CANCEL:
                    // 已撤销可以重新提交并且查看轨迹
                    btns = Lists.newArrayList(BillBtnConst.BTN_SUBMIT, BillBtnConst.BTN_TRACK);
                    break;
                default:
                    log.error("Approval for the current status, there is an error!");
                    throw new RbException(BillCode.CAN_NOT_SEE);
            }
            // 如果审批单在草稿状态，则不能进行打印
            if (printTmplate && billStatus != BillStatus.DRAFTS) {
                btns.add(BillBtnConst.BTN_PRINT);
            }
            return btns;
        } else {
            final long billId = bill.getId();
            // 是否为抄送人员
            final BillCcPersonEntity ccPerson = billCcPersonService.findByEmployeeAndBill(billId, userCode);
            if (ccPerson != null) {
                // 虽然审批单不是我的，但是 抄送给我了哈。。。
                return Lists.newArrayList(BillBtnConst.BTN_TRACK);
            }
            // 不是自己的， 则不能进行查看审批单
            throw new RbException(BillCode.CAN_NOT_SEE);
        }
    }

    /**
     * 根据节点过滤按钮
     *
     * @param billTask 节点任务
     * @param btns     过滤前按钮
     * @return 过滤后按钮
     */
    @Override
    public List<String> filterByNode(BillTaskEntity billTask, List<String> btns) {
        if (Objects.isNull(billTask)) {
            return btns;
        }
        final String taskId = billTask.getTaskId();
        final Optional<ProcessNodeExtendEntity> byTaskId = nodeExtendService.findByTaskId(taskId);
        if (byTaskId.isPresent()) {
            final ProcessNodeExtendEntity processNodeExtendEntity = byTaskId.get();
            final String btns1 = processNodeExtendEntity.getBtns();
            final List<String> split = StrUtil.split(btns1, ',');
            split.add(BillBtnConst.BTN_SUBMIT);
            split.add(BillBtnConst.BTN_CANCEL);
            split.add(BillBtnConst.BTN_TRACK);
            split.add(BillBtnConst.BTN_ENDORSE);
            return btns.stream().filter(a -> split.contains(a)).collect(Collectors.toList());
        } else {
            return btns;
        }
    }

    /**
     * 根据业务流程主键获取扩展的自定义按钮
     *
     * @param processId 业务流程主键
     * @return 扩展按钮
     */
    private List<String> findFormExtensions(long processId) {
        final List<String> btns = Lists.newArrayList();
        final List<FormExtensionsEntity> formExtensions;
        formExtensions = formExpressionService.findByProcessId(processId);
        if (CollectionUtil.isNotEmpty(formExtensions)) {
            for (FormExtensionsEntity formExtension : formExtensions) {
                final String type = formExtension.getType();
                if (Strings.isNullOrEmpty(type)) {
                    continue;
                }
                if (StringUtils.equals(type, "001")) {
                    // 001 暂时硬编码，后续形成常量 表示为自定义扩展的表单扩展功能
                    final String feature = formExtension.getFeature();
                    if (Strings.isNullOrEmpty(feature) || btns.contains(feature)) {
                        continue;
                    }
                    btns.add(feature);
                }
            }
        }
        return btns;
    }

    /**
     * 判断是否存在打印模板
     *
     * @param processId 业务流程主键
     * @return true表示存在，false 表示不存在
     */
    private boolean hasPrintTemplate(long processId) {
        final FormSettingEntity processSetting = formSettingService.findByProcess(processId);
        boolean printTmplate = false;
        if (processSetting != null) {
            final String printTemplatePath = processSetting.getPrintTemplatePath();
            printTmplate = !Strings.isNullOrEmpty(printTemplatePath);
        }
        return printTmplate;
    }
}

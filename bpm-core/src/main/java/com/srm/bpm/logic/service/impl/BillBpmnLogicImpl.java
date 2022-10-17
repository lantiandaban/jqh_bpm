

package com.srm.bpm.logic.service.impl;

import com.google.common.base.MoreObjects;
import com.google.common.base.Optional;
import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.srm.bpm.infra.entity.BillTaskEntity;
import com.srm.bpm.infra.entity.ProcessNodeExtendEntity;
import com.srm.bpm.infra.entity.ProcessNodeFormFieldEntity;
import com.srm.bpm.infra.entity.ToaBillEntity;
import com.srm.bpm.infra.po.FormFieldPO;
import com.srm.bpm.infra.po.ProcessDetailPO;
import com.srm.bpm.infra.service.BillReadRecordService;
import com.srm.bpm.infra.service.BillTaskService;
import com.srm.bpm.infra.service.FormFieldService;
import com.srm.bpm.infra.service.ProcessNodeExtendService;
import com.srm.bpm.infra.service.ProcessNodeFormFieldService;
import com.srm.bpm.infra.service.ToaBillService;
import com.srm.bpm.logic.constant.BillAction;
import com.srm.bpm.logic.constant.BillStatus;
import com.srm.bpm.logic.constant.BillTaskStatus;
import com.srm.bpm.logic.constant.BpmnConst;
import com.srm.bpm.logic.constant.NodeLinkType;
import com.srm.bpm.logic.constant.StringPool;
import com.srm.bpm.logic.context.BillDataContext;
import com.srm.bpm.logic.context.BpmnBillContext;
import com.srm.bpm.logic.define.FormXtype;
import com.srm.bpm.logic.dto.OrganizationBpmnDTO;
import com.srm.bpm.logic.dto.PositionBpmnDTO;
import com.srm.bpm.logic.dto.UserInfoDTO;
import com.srm.bpm.logic.dto.UserOrgDTO;
import com.srm.bpm.logic.dto.UserPositionDTO;
import com.srm.bpm.logic.error.BillCode;
import com.srm.bpm.logic.service.BillBpmnLogic;
import com.srm.bpm.logic.service.BillItemLogic;
import com.srm.bpm.logic.service.CallBackLogic;
import com.srm.bpm.logic.service.FlowMsgLogic;
import com.srm.bpm.logic.service.UserCenterlogic;
import com.srm.bpm.logic.vo.FormPermissionVO;
import com.srm.bpm.logic.constant.FormConst;
import com.srm.common.data.exception.RbException;
import com.srm.common.util.datetime.DateTimeUtil;

import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.FlowElement;
import org.activiti.bpmn.model.FlowNode;
import org.activiti.bpmn.model.SequenceFlow;
import org.activiti.bpmn.model.StartEvent;
import org.activiti.bpmn.model.UserTask;
import org.activiti.engine.HistoryService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.Execution;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.runtime.ProcessInstanceQuery;
import org.activiti.engine.task.Task;
import org.activiti.engine.task.TaskQuery;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Triple;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.lang.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static com.srm.bpm.logic.constant.BillStatus.CANCEL;
import static com.srm.bpm.logic.constant.NodeLinkType.create;
import static com.srm.bpm.logic.error.BillCode.CURRENT_TASK_NULL;
import static com.srm.bpm.logic.error.BillCode.TARGET_TASK_NULL;

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
public class BillBpmnLogicImpl implements BillBpmnLogic {
    private final RepositoryService repositoryService;
    private final RuntimeService runtimeService;
    private final TaskService taskService;
    private final IdentityService identityService;
    private final ProcessNodeExtendService nodeExtendService;
    private final ProcessNodeFormFieldService nodeFormFieldService;
    private final BillItemLogic billItemLogic;
    private final FormFieldService formFieldService;
    private final BillTaskService billTaskService;
    private final ToaBillService billService;
    private final BillReadRecordService billReadRecordService;
    private final UserCenterlogic userCenterlogic;
    private final CallBackLogic callBackLogic;
    private final HistoryService historyService;

    private final FlowMsgLogic flowMsgLogic;

    /**
     * 查找某个业务流程的启动节点的业务表单权限
     *
     * @param processId 业务流程主键
     * @return 业务表单字段控制权限
     */
    @Override
    public List<FormPermissionVO> findPermissionByProcessStartNode(long processId) {
        String firstNodeId;
        firstNodeId = nodeExtendService.findTaskNodeIdByProcessAndLinkType(processId, NodeLinkType.create);
        // 获取授权信息
        return nodeFieldPermission(processId, firstNodeId);
    }

    @Override
    @Transactional(readOnly = true, rollbackFor = Exception.class)
    public List<FormPermissionVO> nodeFieldPermission(long processId, String nodeId) {
        if (!Strings.isNullOrEmpty(nodeId)) {
            final List<ProcessNodeFormFieldEntity> nodeFormFields;
            nodeFormFields = nodeFormFieldService.selectByProcessIdAndNodeId(processId, nodeId);
            if (CollectionUtil.isNotEmpty(nodeFormFields)) {
                List<FormPermissionVO> permissionVOS = Lists.newArrayList();
                for (ProcessNodeFormFieldEntity nodeFormField : nodeFormFields) {
                    FormPermissionVO permissionVO = new FormPermissionVO();
                    permissionVO.setHidden(nodeFormField.getVisibleFlag() != 1);
                    permissionVO.setEdit(nodeFormField.getEditFlag() == 1);
                    permissionVO.setWidgetName(nodeFormField.getFormWidgetName());
                    permissionVOS.add(permissionVO);
                }
                return permissionVOS;
            }
        }
        return Collections.emptyList();
    }

    /**
     * 根据审批单和员工ID获取表单权限
     *
     * @param bill     审批单
     * @param userCode 员工ID
     * @return 表单字段控制权限
     */
    @Override
    public List<FormPermissionVO> findPermissionByBill(ToaBillEntity bill, String userCode) {
        if (bill == null) {
            log.error("the bill is null!");
            return Collections.emptyList();
        }
        final long processId = MoreObjects.firstNonNull(bill.getProcessId(), 0L);
        final BillStatus billStatus = BillStatus.valueTo(bill.getStatus());

        if (billStatus == BillStatus.DRAFTS) {
            if (!bill.getSender().equals(userCode)) {
                return Collections.emptyList();
            }
            // 草稿箱
            return findPermissionByProcessStartNode(processId);
        }
        return findPermissionByProcessStartNode(processId);
    }

    /**
     * 指定的流程标志来启动业务流程
     *
     * @param billDataValue 审批单ID
     * @param processDetail 流程标志
     * @param userInfoDTO   当前登录人
     * @return 流程示例信息
     */
    @Override
    public Optional<ProcessInstance> startFlow(BillDataContext billDataValue, ProcessDetailPO processDetail, UserInfoDTO userInfoDTO,
                                               String nextApprover) {
        String processKey = processDetail.getFlowId();
        final ProcessDefinition processDefinition = this.findLastVersionByFlowId(processKey);
        if (processDefinition == null) {
            throw new RbException("业务流程未发布，请联系管理员", BillCode.PROCESS_NOT_FOUND);
        }
        long billId = billDataValue.getId();
        String businessKey = String.valueOf(billId);
        final String authenticatedUserId = userInfoDTO.getCode();
        Map<String, Object> formDataParam;
        formDataParam = parseFormValues(billDataValue, authenticatedUserId, processDetail);
        // 构建流程变量
        final BpmnBillContext bpmnBillContext = createBpmnContext(userInfoDTO, billDataValue);
        final String varDataContext = JSON.toJSONString(bpmnBillContext);

        final Map<String, Object> variables = Maps.newHashMap();
        variables.put(BpmnConst.VAR_FORM_DATA, formDataParam);
        variables.put(BpmnConst.VAR_BILL_CONTEXT, varDataContext);
        variables.put(BpmnConst.VAR_APPLY_PROCESS, processDetail.getId());
        variables.put(BpmnConst.VAR_APPLY_EMPLOYEE, authenticatedUserId);
        variables.put(BpmnConst.VAR_APPROVER_EMPLOYEE, authenticatedUserId);
        variables.put(BpmnConst.VAR_ACTION, BillAction.submit.name());
        variables.put(BpmnConst.VAR_NEXT_APPROVER, nextApprover);
        variables.put(BpmnConst.VAR_AGREE_DATA, Maps.newHashMap());
        final ProcessInstanceQuery query = runtimeService.createProcessInstanceQuery()
                .processInstanceBusinessKey(businessKey).active();
        final List<ProcessInstance> processInstances = query.list();
        if (CollectionUtil.isNotEmpty(processInstances)) {
            // 已经存在流程实例了，则表示是重新填写
            // 更新流程变量
            for (ProcessInstance processInstance : processInstances) {
                runtimeService.setVariables(processInstance.getId(), variables);

                TaskQuery taskQuery = taskService.createTaskQuery()
                        .taskCandidateOrAssigned(authenticatedUserId)
                        .processInstanceId(processInstance.getId())
                        .active();
                //获取申请人的待办任务列表
                List<Task> todoList = taskQuery.list();
                Task firstNodeTask;
                if (CollectionUtil.isNotEmpty(todoList)) {
                    // 具体的任务
                    firstNodeTask = todoList.get(0);
                    taskService.complete(firstNodeTask.getId(), variables);
                }
            }
            // fixed : 重新提交物理表数据问题
            long processId = processDetail.getId();
            billItemLogic.converPhysicalData(authenticatedUserId, processId, billId, formDataParam);
            final ProcessInstance processInstance = processInstances.get(0);
            return Optional.of(processInstance);

        } else {

            final String definitionId = processDefinition.getId();
            List<FlowElement> userTaskNodes;
            userTaskNodes = this.findFirstTaskNode(definitionId);

            if (CollectionUtil.isNotEmpty(userTaskNodes)) {

                UserTask userTask = (UserTask) userTaskNodes.get(0);
                String userTaskId = userTask.getId();

                boolean firstTaskComplete = false;
                Optional<ProcessNodeExtendEntity> nodeExtendOpt;
                nodeExtendOpt = nodeExtendService.findByFlowIdAndNodeId(userTaskId, processKey);
                if (nodeExtendOpt.isPresent()) {
                    ProcessNodeExtendEntity nodeExtend = nodeExtendOpt.get();
                    final String linkType = nodeExtend.getLinkType();
                    // 初始节点
                    firstTaskComplete = StringUtils.equals(linkType, create.name());
                }

                identityService.setAuthenticatedUserId(authenticatedUserId);

                final ProcessInstance processInstance;
                processInstance = runtimeService.startProcessInstanceById(definitionId, businessKey, variables);

                final String processInstanceId = processInstance.getId();
                if (firstTaskComplete) {
                    // 获取第一个节点的任务
                    TaskQuery taskQuery = taskService.createTaskQuery()
                            .taskCandidateOrAssigned(authenticatedUserId)
                            .processInstanceId(processInstanceId)
                            .active();
                    Task firstNodeTask;
                    //获取申请人的待办任务列表
                    List<Task> todoList = taskQuery.list();
                    if (CollectionUtil.isNotEmpty(todoList)) {
                        // 具体的任务
                        firstNodeTask = todoList.get(0);
                        taskService.complete(firstNodeTask.getId(), variables);
                    }
                }
                long processId = processDetail.getId();
                billItemLogic.converPhysicalData(authenticatedUserId, processId, billId, formDataParam);
                return Optional.of(processInstance);
            }
        }

        return Optional.absent();
    }

    @Override
    @Transactional(readOnly = true, rollbackFor = Exception.class)
    public List<FlowElement> findFirstTaskNode(
            String definitionId
    ) {
        final BpmnModel bpmnModel = repositoryService.getBpmnModel(definitionId);
        if (bpmnModel != null) {
            List<FlowElement> nodes = Lists.newArrayList();
            Collection<FlowElement> flowElements = bpmnModel.getMainProcess().getFlowElements();
            if (CollectionUtil.isNotEmpty(flowElements)) {
                for (FlowElement flowElement : flowElements) {
                    if (flowElement instanceof StartEvent) {
                        final List<SequenceFlow> outgoingFlows;
                        outgoingFlows = ((StartEvent) flowElement).getOutgoingFlows();
                        for (SequenceFlow outgoingFlow : outgoingFlows) {
                            final FlowElement targetFlowElement = outgoingFlow.getTargetFlowElement();
                            nodes.add(targetFlowElement);
                        }
                    }
                }
            }
            return nodes;
        }
        return Collections.emptyList();
    }

    /**
     * 构建BPMN 上下文 传输变量
     *
     * @param userInfoDTO   申请人
     * @param billDataValue 申请单数据对象
     * @return 上下文流程变量
     */
    private BpmnBillContext createBpmnContext(UserInfoDTO userInfoDTO, BillDataContext billDataValue) {
        BpmnBillContext bpmnBillContext = new BpmnBillContext();
        // 1. 获取员工信息
        bpmnBillContext.setId(userInfoDTO.getId());
        bpmnBillContext.setCode(userInfoDTO.getCode());
        bpmnBillContext.setName(userInfoDTO.getNickname());
        // 2. 获取所在部门
        final List<UserOrgDTO> orgs = userInfoDTO.getOrgs();
        if (CollectionUtil.isNotEmpty(orgs)) {
            final UserOrgDTO userOrgDTO = orgs.get(0);
            OrganizationBpmnDTO organizationBpmnDTO = new OrganizationBpmnDTO();
            organizationBpmnDTO.setCode(userOrgDTO.getOrgCode());
            organizationBpmnDTO.setId(userOrgDTO.getOrgId());
            organizationBpmnDTO.setName(userOrgDTO.getOrgName());
            bpmnBillContext.setOrg(organizationBpmnDTO);
        }
        // 3. 获取所在部门以及指定员工的职位列表
        List<UserPositionDTO> positions = userInfoDTO.getPositions();
        if (CollectionUtil.isNotEmpty(positions)) {
            List<PositionBpmnDTO> positionBpmns = Lists.newArrayListWithCapacity(positions.size());
            for (UserPositionDTO position : positions) {
                PositionBpmnDTO positionBpmnDTO = new PositionBpmnDTO();
                positionBpmnDTO.setId(position.getPositionId());
                positionBpmnDTO.setCode(position.getPositionCode());
                positionBpmnDTO.setName(position.getPositionName());
                positionBpmns.add(positionBpmnDTO);
            }
            bpmnBillContext.setPositions(positionBpmns);
        }
        if (billDataValue != null) {
            bpmnBillContext.setProjectTypes(billDataValue.getProjectTypes());
        }
        return bpmnBillContext;
    }

    /**
     * 解析字段数据，进行格式以及默认值处理
     *
     * @param billDataValue       审批上下文信息
     * @param authenticatedUserId 当前登录员工
     * @param processDetail       业务流程信息
     * @return 处理后的表单字段数据
     */
    private Map<String, Object> parseFormValues(BillDataContext billDataValue, String authenticatedUserId, ProcessDetailPO processDetail) {


        final Map<String, Object> formDataMap = billDataValue.getFormDataMap();
        long processId = processDetail.getId();
        final List<FormFieldPO> formFields = formFieldService.findVoByProcessId(processId);
        if (CollectionUtil.isEmpty(formFields)) {
            throw new RbException(BillCode.FORM_FIELD_ERROR);
        }
        Map<String, Object> formDataParam = Maps.newHashMapWithExpectedSize(formDataMap.size());
        for (FormFieldPO formField : formFields) {
            final String widgetName = formField.getWidgetName();

            final Object widgetValue = formDataMap.get(widgetName);

            final String type = formField.getType();
            final FormXtype xtype = FormXtype.valueOf(type);
            switch (xtype) {
                case triggerselect: {
                    Triple<String, String, Set<Object>> triggerValue;
                    triggerValue = billItemLogic.getTriggerValue(formField, widgetValue);
                    final String dataValue = triggerValue.getLeft();
                    if (Strings.isNullOrEmpty(dataValue)) {
                        formDataParam.put(widgetName, StringPool.EMPTY);
                        formDataParam.put(widgetName + FormConst.FIELD_EXT_NAME, StringPool.EMPTY);
                    } else {
                        formDataParam.put(widgetName, dataValue);
                        formDataParam.put(widgetName + FormConst.FIELD_EXT_NAME, triggerValue.getMiddle());
                    }
                    break;
                }
                case detailgroup: {
                    final List<FormFieldPO> detailFields = formField.getDetailFields();

                    if (widgetValue instanceof JSONArray) {
                        Map<String, FormFieldPO> detailFiledTemp = Maps.newHashMap();
                        for (FormFieldPO detailField : detailFields) {
                            detailFiledTemp.put(detailField.getWidgetName(), detailField);
                        }
                        JSONArray detailValues = (JSONArray) widgetValue;
                        List<Map<String, Object>> detailValueMap = Lists.newArrayList();

                        if (CollectionUtil.isNotEmpty(detailValues)) {
                            for (Object detailValue : detailValues) {
                                JSONObject detailObject = (JSONObject) detailValue;
                                Map<String, Object> detailMap;
                                detailMap = getDetailValues(detailFiledTemp, detailObject);
                                detailValueMap.add(detailMap);
                            }
                            formDataParam.put(widgetName, detailValueMap);
                        }
                    }
                    break;
                }
                default:
                    final Map<String, Object> params = billItemLogic.parseFileValue(formField, widgetValue);
                    formDataParam.putAll(params);
                    break;
            }
        }
        return formDataParam;
    }

    private Map<String, Object> getDetailValues(Map<String, FormFieldPO> detailFiledTemp, JSONObject detailObject) {
        Map<String, Object> detailMap = Maps.newHashMap();
        for (String widgetDetailName : detailObject.keySet()) {

            final Object widgetDetailvalue = detailObject.get(widgetDetailName);
            final FormFieldPO formFieldVO = detailFiledTemp.get(widgetDetailName);

            final Map<String, Object> params;
            params = billItemLogic.parseFileValue(formFieldVO, widgetDetailvalue);
            detailMap.putAll(params);
        }
        return detailMap;
    }

    @Override
    @Transactional(readOnly = true, rollbackFor = Exception.class)
    public ProcessDefinition findLastVersionByFlowId(String flowId) {
        return repositoryService
                .createProcessDefinitionQuery()
                .processDefinitionKey(flowId)
                .latestVersion() // 获取最后一个版本
                .singleResult();
    }

    /**
     * 根据审批单主键和员工主键以及任务主键，查找具体的审批任务
     *
     * @param billId   审批单主键
     * @param taskId   Activiti任务主键
     * @param userCode 用户编码
     * @return 审批任务
     */
    @Override
    public Optional<BillTaskEntity> findTaskBybillAndEmployeeAndTaskId(long billId, String taskId, String userCode) {
        if (billId <= 0 || Strings.isNullOrEmpty(taskId) || Strings.isNullOrEmpty(userCode)) {
            return Optional.absent();
        }
        return this.billTaskService.findByBillAndEmployeeAndTaskId(billId, taskId, userCode);
    }

    /**
     * 审批同意意见
     *
     * @param taskId   审批任务
     * @param opinion  审批意见
     * @param userCode 审批人编号
     * @return 是否操作成功
     */
    @Override
    public boolean complete(ToaBillEntity bill, String taskId, String opinion, String userCode, String nextApprover, String formData, String lastTaskNodeId, String lastTaskId) {
//        final Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
//        if (task == null) {
//            throw new RbException(BillCode.TASK_NOT_FOUND);
//        }
        Map<String, Object> variables = Maps.newHashMap();
        variables.put(BpmnConst.VAR_OPINION, opinion);
        variables.put(BpmnConst.VAR_APPROVER_EMPLOYEE, userCode);
        variables.put(BpmnConst.VAR_ACTION, BillAction.agree.name());
        variables.put(BpmnConst.VAR_NEXT_APPROVER, nextApprover);
        variables.put(BpmnConst.VAR_LAST_NODE_KEY, lastTaskNodeId);
        variables.put(BpmnConst.VAR_LAST_TASK_ID, lastTaskId);
        variables.put(BpmnConst.VAR_AGREE_DATA, JSON.parseObject(formData, Map.class));
        taskService.complete(taskId, variables);
        return true;
    }

    /**
     * 审批拒绝接口
     *
     * @param taskId   审批任务
     * @param opinion  拒绝意见
     * @param userCode 审批人
     * @return 是否操作成功
     */
    @Override
    public boolean refuse(ToaBillEntity bill, String taskId, String opinion, String userCode) {
        final Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
        if (task == null) {
            throw new RbException(BillCode.TASK_NOT_FOUND);
        }
        Map<String, Object> variables = Maps.newHashMap();
        variables.put(BpmnConst.VAR_OPINION, opinion);
        variables.put(BpmnConst.VAR_APPROVER_EMPLOYEE, userCode);
        variables.put(BpmnConst.VAR_ACTION, BillAction.refuse.name());
        taskService.complete(task.getId(), variables);
        return true;
    }

    /**
     * 撤回某个审批单
     *
     * @param bill     审批单
     * @param taskId   审批任务
     * @param opinion  撤回原因
     * @param userCode 发起人
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void recall(ToaBillEntity bill, String taskId, String opinion, String userCode) {
        final long billId = MoreObjects.firstNonNull(bill.getId(), 0L);

        String businessKey = String.valueOf(billId);

        final ProcessInstanceQuery query = runtimeService.createProcessInstanceQuery()
                .processInstanceBusinessKey(businessKey).active();
        final List<ProcessInstance> processInstanceList = query.list();

        for (ProcessInstance processInstance : processInstanceList) {
            runtimeService.deleteProcessInstance(processInstance.getId(), opinion);
        }

        final List<BillTaskEntity> tasks = billTaskService.findByBillId(billId);
        List<BillTaskEntity> appringTasks = Lists.newArrayList();
        if (CollectionUtil.isNotEmpty(tasks)) {
            // cancel bill task
            final int taskSize = tasks.size();
            List<BillTaskEntity> billTasks = Lists.newArrayListWithCapacity(taskSize);
            final int dateline = DateTimeUtil.unixTime();
            List<Long> taskIds = Lists.newArrayList();
            for (BillTaskEntity task : tasks) {
                final BillTaskStatus taskStatus = BillTaskStatus.valueTo(task.getNodeStatus());
                if (taskStatus == BillTaskStatus.APPROVAL) {
                    appringTasks.add(task);
                }
                task.setNodeStatus(BillTaskStatus.APPLY_CANCEL.getStatus());
                task.setDateline(dateline);
                // 对所有的审批任务进行删除处理
                task.setIsDeleted(1);
                task.setUpdateTime(LocalDateTime.now());
                billTasks.add(task);
                taskIds.add(task.getId());
            }

            // 创建一个任务为为取消

            BillTaskEntity billTask = new BillTaskEntity();
            billTask.setOpinion(opinion);
            billTask.setDateline(dateline);
            billTask.setNodeStatus(BillTaskStatus.CANCEL.getStatus());
            billTask.setAction(BillAction.recall.name());
            billTask.setBillId(billId);
            billTask.setUserCode(userCode);
            billTask.setSort(System.currentTimeMillis());

            final boolean recallTask = billTaskService.insert(billTask);
            if (!recallTask) {
                throw new RbException("recall back has error!");
            }
            // update  database
            final boolean updateState = billTaskService.updateBatchById(billTasks);
            billTaskService.removeByIds(taskIds);
            if (!updateState) {
                throw new RbException("update task status has error");
            }
            bill.setStatus(BillStatus.CANCEL.getStatus());
            bill.setProcessInstanceId(StringPool.EMPTY);
            bill.setId(billId);
            final boolean update = billService.upldate(bill);
            if (!update) {
                throw new RbException("bill update status update error!");
            }
            final ToaBillEntity byId = billService.getById(billId);
            callBackLogic.callBack(byId.getProcessId(), billId, CANCEL.getStatus());
            //  删除所有的已读记录
            final boolean removeOk = billReadRecordService.deleteByBillId(billId);
            flowMsgLogic.sendMsg(appringTasks, true);
        }
    }

    @Override
    public BpmnBillContext createBpmnContext(String employeeId, BillDataContext billDataValue) {
        BpmnBillContext bpmnBillContext = new BpmnBillContext();
        // 1. 获取员工信息
        final UserInfoDTO userInfoDTO = userCenterlogic.getUserInfoByCode(employeeId);
        bpmnBillContext.setId(userInfoDTO.getId());
        bpmnBillContext.setCode(userInfoDTO.getCode());
        bpmnBillContext.setName(userInfoDTO.getNickname());
        // 2. 获取所在部门
        // 2. 获取所在部门
        final List<UserOrgDTO> orgs = userInfoDTO.getOrgs();
        if (CollectionUtil.isNotEmpty(orgs)) {
            final UserOrgDTO userOrgDTO = orgs.get(0);
            OrganizationBpmnDTO organizationBpmnDTO = new OrganizationBpmnDTO();
            organizationBpmnDTO.setCode(userOrgDTO.getOrgCode());
            organizationBpmnDTO.setId(userOrgDTO.getOrgId());
            organizationBpmnDTO.setName(userOrgDTO.getOrgName());
            bpmnBillContext.setOrg(organizationBpmnDTO);
            // 3. 获取所在部门以及指定员工的职位列表
            List<UserPositionDTO> positions = userCenterlogic.getUserPositionByUserAndOrg(employeeId, userOrgDTO.getOrgId());
            if (CollectionUtil.isNotEmpty(positions)) {
                List<PositionBpmnDTO> positionBpmns = Lists.newArrayListWithCapacity(positions.size());
                for (UserPositionDTO position : positions) {
                    PositionBpmnDTO positionBpmnDTO = new PositionBpmnDTO();
                    positionBpmnDTO.setId(position.getPositionId());
                    positionBpmnDTO.setCode(position.getPositionCode());
                    positionBpmnDTO.setName(position.getPositionName());
                    positionBpmns.add(positionBpmnDTO);
                }
                bpmnBillContext.setPositions(positionBpmns);
            }
        }
        return bpmnBillContext;
    }

    /**
     * 提交任务到指定节点
     *
     * @param task             任务节点对象
     * @param variables        流程变量
     * @param targetActivityId 目标活动id
     */
    @Override
    public void commitProcess(Task task, Map<String, Object> variables, String targetActivityId) {
        // TODO: 2021/6/21 未测试
        //获取当前节点Id
        String currentActivityId = task.getTaskDefinitionKey();
        //获取模型实体
        String processDefinitionId = task.getProcessDefinitionId();
        BpmnModel bpmnModel = repositoryService.getBpmnModel(processDefinitionId);
        //获取当前节点
        FlowElement currentFlow = bpmnModel.getFlowElement(currentActivityId);
        //获取目标节点
        FlowElement targetFlow = bpmnModel.getFlowElement(targetActivityId);
        //创建连线
        String uuid = UUID.randomUUID().toString().replace("-", "");
        SequenceFlow newSequenceFlow = new SequenceFlow();
        newSequenceFlow.setId(uuid);
        newSequenceFlow.setSourceFlowElement(currentFlow);
        newSequenceFlow.setTargetFlowElement(targetFlow);
        //设置条件
        newSequenceFlow.setConditionExpression("${\"+uuid+\"==\"" + uuid + "\"}");
        //添加连线至bpmn
        bpmnModel.getMainProcess().addFlowElement(newSequenceFlow);
        //添加变量（保证这根线独一无二）
        variables.clear();//清空变量，防止干扰
        variables.put(uuid, uuid);
        //提交
        taskService.addComment(task.getId(), task.getProcessInstanceId(), "撤回");
        //完成任务
        taskService.complete(task.getId(), variables);
        //删除连线
        bpmnModel.getMainProcess().removeFlowElement(uuid);
    }

    /**
     * 退回到指定节点
     */
    @Override
    public void returnToTargetTask(BillTaskEntity taskId, BillTaskEntity targetId, String userCode, String opinion, String nextApprover) {
        // 取得流程定义
        final Task task = taskService.createTaskQuery().taskId(taskId.getTaskId()).singleResult();
        if (Objects.isNull(task)) {
            throw new RbException(CURRENT_TASK_NULL);
        }
        final String processDefinitionId = task.getProcessDefinitionId();
        //变量
        List<HistoricActivityInstance> haiList = historyService.createHistoricActivityInstanceQuery()
                .executionId(task.getExecutionId()).finished().list();
        String targetActivityId = "";
        for (HistoricActivityInstance historicActivityInstance : haiList) {
            if (targetId.getTaskId().equals(historicActivityInstance.getTaskId())) {
                targetActivityId = historicActivityInstance.getActivityId();
                break;
            }
        }
        if (Strings.isNullOrEmpty(targetActivityId)) {
            throw new RbException(TARGET_TASK_NULL);
        }
        BpmnModel bpmnModel = repositoryService.getBpmnModel(processDefinitionId);
        FlowNode targetFlowNod = (FlowNode) bpmnModel.getMainProcess().getFlowElement(targetActivityId);
        Execution execution = runtimeService.createExecutionQuery().executionId(task.getExecutionId()).singleResult();
        String activityId = execution.getActivityId();
        FlowNode flowNode = (FlowNode) bpmnModel.getMainProcess().getFlowElement(activityId);

        //记录原活动方向
        List<SequenceFlow> oriSequenceFlows = Lists.newArrayList();
        oriSequenceFlows.addAll(flowNode.getOutgoingFlows());

        //清理活动方向
        flowNode.getOutgoingFlows().clear();
        //建立新方向
        List<SequenceFlow> newSequenceFlowList = Lists.newArrayList();
        SequenceFlow newSequenceFlow = new SequenceFlow();
        newSequenceFlow.setId("newSequenceFlowId");
        newSequenceFlow.setSourceFlowElement(flowNode);
        newSequenceFlow.setTargetFlowElement(targetFlowNod);
        newSequenceFlowList.add(newSequenceFlow);
        flowNode.setOutgoingFlows(newSequenceFlowList);
        Map<String, Object> variables = Maps.newHashMap();
        variables.put(BpmnConst.VAR_OPINION, opinion);
        variables.put(BpmnConst.VAR_APPROVER_EMPLOYEE, userCode);
        variables.put(BpmnConst.VAR_ACTION, BillAction.back.name());
        variables.put(BpmnConst.VAR_LAST_NODE_KEY, taskId.getTaskNodeKey());
        variables.put(BpmnConst.VAR_LAST_TASK_ID, taskId.getTaskId());
        variables.put(BpmnConst.VAR_NEXT_APPROVER, nextApprover);
        taskService.complete(task.getId(), variables);
        //恢复原方向
        flowNode.setOutgoingFlows(oriSequenceFlows);
    }


}



package com.srm.bpm.logic.service;

import com.google.common.base.Optional;

import com.srm.bpm.infra.entity.BillTaskEntity;
import com.srm.bpm.infra.entity.ToaBillEntity;
import com.srm.bpm.infra.po.ProcessDetailPO;
import com.srm.bpm.logic.context.BillDataContext;
import com.srm.bpm.logic.context.BpmnBillContext;
import com.srm.bpm.logic.dto.UserInfoDTO;
import com.srm.bpm.logic.vo.FormPermissionVO;

import org.activiti.bpmn.model.FlowElement;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface BillBpmnLogic {
    /**
     * 查找某个业务流程的启动节点的业务表单权限
     *
     * @param processId 业务流程主键
     * @return 业务表单字段控制权限
     */
    List<FormPermissionVO> findPermissionByProcessStartNode(long processId);

    List<FormPermissionVO> nodeFieldPermission(long processId, String nodeId);

    /**
     * 根据审批单和员工ID获取表单权限
     *
     * @param bill     审批单
     * @param userCode 员工ID
     * @return 表单字段控制权限
     */
    List<FormPermissionVO> findPermissionByBill(ToaBillEntity bill, String userCode);

    /**
     * 指定的流程标志来启动业务流程
     *
     * @param billDataValue 审批单ID
     * @param processDetail 流程标志
     * @param userInfoDTO   当前登录人
     * @param nextApprover  下一个节点审批人
     * @return 流程示例信息
     */
    Optional<ProcessInstance> startFlow(BillDataContext billDataValue, ProcessDetailPO processDetail, UserInfoDTO userInfoDTO,
                                        String nextApprover);

    /**
     * 获取某个流程定义下，指定节点类型（比如用户任务）的前几个节点信息
     *
     * @param definitionId 流程定义信息
     * @return 节点信息
     */
    @Transactional(readOnly = true, rollbackFor = Exception.class)
    List<FlowElement> findFirstTaskNode(
            String definitionId
    );

    @Transactional(readOnly = true, rollbackFor = Exception.class)
    ProcessDefinition findLastVersionByFlowId(String flowId);

    /**
     * 根据审批单主键和员工主键以及任务主键，查找具体的审批任务
     *
     * @param billId   审批单主键
     * @param taskId   Activiti任务主键
     * @param userCode 用户编码
     * @return 审批任务
     */
    Optional<BillTaskEntity> findTaskBybillAndEmployeeAndTaskId(long billId, String taskId, String userCode);

    /**
     * 审批同意意见
     *
     * @param taskId   审批任务
     * @param opinion  审批意见
     * @param userCode 审批人编号
     * @return 是否操作成功
     */
    boolean complete(ToaBillEntity bill, String taskId, String opinion, String userCode, String nextApprover, String formData, String lastTaskNodeId, String lastTaskId);

    /**
     * 审批拒绝接口
     *
     * @param taskId   审批任务
     * @param opinion  拒绝意见
     * @param userCode 审批人
     * @return 是否操作成功
     */
    boolean refuse(ToaBillEntity bill, String taskId, String opinion, String userCode);

    /**
     * 撤回某个审批单
     *
     * @param bill     审批单
     * @param taskId   审批任务
     * @param opinion  撤回原因
     * @param userCode 发起人
     */
    void recall(ToaBillEntity bill, String taskId, String opinion, String userCode);

    BpmnBillContext createBpmnContext(String employeeId, BillDataContext billDataValue);


    /**
     * 提交任务到指定节点
     *
     * @param task             任务节点对象
     * @param variables        流程变量
     * @param targetActivityId 目标活动id
     */
    void commitProcess(Task task, Map<String, Object> variables, String targetActivityId);


    void returnToTargetTask(BillTaskEntity taskId, BillTaskEntity targetId, String userCode, String opinion, String nextApprover
    );
}

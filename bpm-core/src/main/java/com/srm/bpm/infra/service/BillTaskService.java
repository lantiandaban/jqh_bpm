 

package com.srm.bpm.infra.service;

import com.google.common.base.Optional;

import com.srm.bpm.infra.entity.BillTaskEntity;
import com.srm.bpm.infra.entity.ToaBillEntity;
import com.srm.bpm.infra.po.BillApprovalHistoryPO;
import com.srm.bpm.logic.dto.BillActionParamDTO;
import com.srm.bpm.logic.dto.BillTaskDTO;
import com.srm.common.base.infra.service.BaseService;

import java.util.List;
import java.util.Map;

/**
 * <p>
 * 审批单审批人信息 服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface BillTaskService extends BaseService<BillTaskEntity> {

    /**
     * 根据审批单主键和员工主键，找到具体对应的审批任务，如果没有，则返回 Optional.absent();
     *
     * @param billId   审批单主键
     * @param userCode 用户编号
     * @return 审批任务 Optional
     */
    List<BillTaskEntity> findTaskByBillAndUserCode(long billId, String userCode);

    /**
     * 取得所有已经审批后的审批任务
     *
     * @param billId 审批单
     * @return 审批单的审批任务 key为节点任务id
     */
    Map<String, List<BillTaskEntity>> findApprovedByBill(long billId);

    /**
     * 当启动流程时，如果是重新发起流程，则进行审批任务的更新
     *
     * @param billId   审批单
     * @param userCode 审批任务
     */
    void updateByReFullIn(long billId, String userCode);

    /**
     * 根据审批单和审批人以及审批任务ID获取审批任务
     *
     * @param billId   审批单
     * @param taskId   审批任务ID
     * @param userCode 审批人
     * @return 审批任务
     */
    Optional<BillTaskEntity> findByBillAndEmployeeAndTaskId(long billId, String taskId, String userCode);

    /**
     * 查询排除自己的审批中数量
     *
     * @param billId 表单id
     * @param taskId 任务id
     * @param id     当前billTaskId
     * @return 数量
     */
    int findActiveExcludeSelf(Long billId, String taskId, Long id);

    /**
     * 查询节点全部审批任务数量不包括转办
     *
     * @param billId 审批单id
     * @param taskId 任务id
     * @return 数量
     */
    int findTotalCount(Long billId, String taskId,int type);

    /**
     * 同意审批任务的时候，处理任务信息
     *
     * @param task        审批任务
     * @param userCode    用户编码
     * @param actionParam 请求参数
     */
    void agreeTask(BillTaskEntity task, String userCode, BillActionParamDTO actionParam);

    /**
     * 删除任务节点中审批中的数据
     *
     * @param billId 审批单id
     * @param taskId 几点任务id
     * @param status 审批中状态
     */
    void deleteApproval(Long billId, String taskId, int status);

    /**
     * 查找某个审批单的审批任务信息
     *
     * @param bill 审批单
     * @return 审批任务
     */
    List<BillApprovalHistoryPO> findByBill(ToaBillEntity bill);

    /**
     * 查询billId所有的审批任务
     *
     * @param billId 审批id
     * @return 节点任务
     */
    List<BillTaskEntity> findByBillId(long billId);

    /**
     * 查询当前节点正在审批中的任务
     *
     * @param billId 单据id
     * @param taskId 节点任务id
     * @return 节点集合
     */
    List<BillTaskEntity> findApprovingByBillAndTaskId(long billId, String taskId);

    /**
     * 当前审批人在当前节点的所有加签任务
     *
     * @param billId   单据id
     * @param taskId   任务id
     * @param userCode 用户
     * @return 任务列表
     */
    List<BillTaskEntity> findEndorseByUserAndTaskId(long billId, String taskId, String userCode);

    /**
     * 查询当前表单最新的创建任务
     * @param billId 表单id
     * @return 创建节点任务
     */
    BillTaskEntity findCreateTaskByBill(long billId);

    /**
     * 保存跳过的节点任务
     */
    void saveSkipTask(String taskNodeId, Long billId, String taskId, String taskName,String lastTaskNodeId,String lastTaskId);

    /**
     * 获取当前用户审批中的节点名称
     * @param billId 审批单id
     * @param user 用户
     * @return 节点信息
     */
    List<BillTaskEntity> findApprovingByBillAndUser(long billId, String user);

    /**
     * 查询审批单已经审批的节点
     *
     * @param billid 审批单id
     * @return 审批节点
     */
    List<BillTaskDTO> getHistoryTasks(Long billid);

    List<BillTaskEntity> findApprovedByBillAndUser(long billId, String user);
}



package com.srm.bpm.infra.service.impl;

import com.google.common.base.Optional;
import com.google.common.base.Strings;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.srm.bpm.logic.constant.BillAction;
import com.srm.bpm.logic.constant.BillTaskStatus;
import com.srm.bpm.logic.constant.BillTaskType;
import com.srm.bpm.logic.constant.Const;
import com.srm.bpm.logic.constant.NodeLinkType;
import com.srm.bpm.logic.dto.BillActionParamDTO;
import com.srm.bpm.logic.dto.BillTaskDTO;
import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.bpm.infra.dao.BillTaskDao;
import com.srm.bpm.infra.entity.BillTaskEntity;
import com.srm.bpm.infra.entity.ToaBillEntity;
import com.srm.bpm.infra.po.BillApprovalHistoryPO;
import com.srm.bpm.infra.service.BillTaskService;
import com.srm.common.util.datetime.DateTimeUtil;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollectionUtil;

/**
 * <p>
 * 审批单审批人信息 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
public class BillTaskServiceImpl extends BaseServiceImpl<BillTaskDao, BillTaskEntity> implements BillTaskService {

    /**
     * 根据审批单主键和员工主键，找到具体对应的审批任务，如果没有，则返回 Optional.absent();
     *
     * @param billId   审批单主键
     * @param userCode 用户编号
     * @return 审批任务 Optional
     */
    @Override
    public List<BillTaskEntity> findTaskByBillAndUserCode(long billId, String userCode) {
        final List<BillTaskEntity> billTask = this.baseMapper.selectTaskByBillAndUserCode(billId, userCode);
        return billTask;
    }

    /**
     * 取得所有已经审批后的审批任务
     *
     * @param billId 审批单
     * @return 审批单的审批任务 key为节点任务id
     */
    @Override
    public Map<String, List<BillTaskEntity>> findApprovedByBill(long billId) {
        if (billId <= 0) {
            return Collections.emptyMap();
        }
        final List<BillTaskEntity> billTasks = list(Wrappers.lambdaQuery(BillTaskEntity.class).eq(BillTaskEntity::getBillId, billId));
        if (CollectionUtil.isNotEmpty(billTasks)) {
            final Map<String, List<BillTaskEntity>> collect = billTasks.stream().collect(Collectors.groupingBy(BillTaskEntity::getNodeName));
            return collect;
        }
        return Collections.emptyMap();
    }

    /**
     * 当启动流程时，如果是重新发起流程，则进行审批任务的更新
     *
     * @param billId   审批单
     * @param userCode 审批任务
     */
    @Override
    public void updateByReFullIn(long billId, String userCode) {
        if (billId > 0 && !Strings.isNullOrEmpty(userCode)) {
            this.baseMapper.updateByRefullIn(billId, userCode, DateTimeUtil.unixTime());
        }
    }

    /**
     * 根据审批单和审批人以及审批任务ID获取审批任务
     *
     * @param billId   审批单
     * @param taskId   审批任务ID
     * @param userCode 审批人
     * @return 审批任务
     */
    @Override
    public Optional<BillTaskEntity> findByBillAndEmployeeAndTaskId(long billId, String taskId, String userCode) {
        final LambdaQueryWrapper<BillTaskEntity> queryWrapper = Wrappers.lambdaQuery(BillTaskEntity.class).eq(BillTaskEntity::getBillId, billId)
                .eq(BillTaskEntity::getTaskId, taskId).eq(BillTaskEntity::getUserCode, userCode).orderByDesc(BillTaskEntity::getSort);
        final java.util.Optional<BillTaskEntity> optional = unique(queryWrapper);
        if (!optional.isPresent()) {
            return Optional.absent();
        }
        return Optional.of(optional.get());
    }

    /**
     * 查询排除自己的审批中数量
     *
     * @param billId 表单id
     * @param taskId 任务id
     * @param id     当前billTaskId
     * @return 数量
     */
    @Override
    public int findActiveExcludeSelf(Long billId, String taskId, Long id) {
        return baseMapper.selectActiveExcludeSelf(billId, taskId, id, BillTaskStatus.AGREE.getStatus());
    }

    /**
     * 查询节点全部审批任务数量
     *
     * @param billId 审批单id
     * @param taskId 任务id
     * @return 数量
     */
    @Override
    public int findTotalCount(Long billId, String taskId,int type) {
        return baseMapper.selectTotalCount(billId, taskId,type);
    }

    /**
     * 同意审批任务的时候，处理任务信息
     *
     * @param task        审批任务
     * @param userCode    用户编码
     * @param actionParam 请求参数
     */
    @Override
    public void agreeTask(BillTaskEntity task, String userCode, BillActionParamDTO actionParam) {
        final int dateline = DateTimeUtil.unixTime();
        task.setNodeStatus(BillTaskStatus.AGREE.getStatus());
        task.setUserCode(userCode);
        task.setUpdateTime(LocalDateTime.now());
        task.setOpinion(actionParam.getOpinion());
        task.setDateline(dateline);
        task.setAction(BillAction.agree.name());
        task.setId(null);
        final LambdaUpdateWrapper<BillTaskEntity> billTaskEntityLambdaUpdateWrapper = Wrappers.lambdaUpdate();
        billTaskEntityLambdaUpdateWrapper.eq(BillTaskEntity::getBillId, actionParam.getBillId())
                .eq(BillTaskEntity::getUserCode, userCode).eq(BillTaskEntity::getTaskId, actionParam.getTaskId())
                .eq(BillTaskEntity::getNodeStatus, BillTaskStatus.APPROVAL.getStatus());
        this.update(task, billTaskEntityLambdaUpdateWrapper);

    }

    /**
     * 删除任务节点中审批中的数据
     *
     * @param billId 审批单id
     * @param taskId 几点任务id
     * @param status 审批中状态
     */
    @Override
    public void deleteApproval(Long billId, String taskId, int status) {
        final LambdaQueryWrapper<BillTaskEntity> queryWrapper = Wrappers.lambdaQuery(BillTaskEntity.class).eq(BillTaskEntity::getBillId, billId)
                .eq(BillTaskEntity::getTaskId, taskId).eq(BillTaskEntity::getNodeStatus, status);
        remove(queryWrapper);
    }

    /**
     * 查找某个审批单的审批任务信息
     *
     * @param bill 审批单
     * @return 审批任务
     */
    @Override
    public List<BillApprovalHistoryPO> findByBill(ToaBillEntity bill) {
        long billId = bill.getId();
        // 先冗余处理状态 归档逻辑
        final List<BillApprovalHistoryPO> approvalHistorys;
        approvalHistorys = baseMapper.selectHistoryByBillId(billId);
        return approvalHistorys;
    }

    /**
     * 查询billId所有的审批任务
     *
     * @param billId 审批id
     * @return 节点任务
     */
    @Override
    public List<BillTaskEntity> findByBillId(long billId) {
        return list(Wrappers.lambdaQuery(BillTaskEntity.class).eq(BillTaskEntity::getBillId, billId));
    }

    /**
     * 查询当前节点正在审批中的任务
     *
     * @param billId 单据id
     * @param taskId 节点任务id
     * @return 节点集合
     */
    @Override
    public List<BillTaskEntity> findApprovingByBillAndTaskId(long billId, String taskId) {
        final LambdaQueryWrapper<BillTaskEntity> queryWrapper = Wrappers.lambdaQuery(BillTaskEntity.class)
                .eq(BillTaskEntity::getBillId, billId).eq(BillTaskEntity::getTaskType, BillTaskType.DEFAULT.getValue());
        queryWrapper.eq(BillTaskEntity::getNodeStatus, BillTaskStatus.APPROVAL.getStatus()).eq(BillTaskEntity::getTaskId, taskId);
        return this.list(queryWrapper);
    }

    /**
     * 当前审批人在当前节点的所有加签任务
     *
     * @param billId   单据id
     * @param taskId   任务id
     * @param userCode 用户
     * @return 任务列表
     */
    @Override
    public List<BillTaskEntity> findEndorseByUserAndTaskId(long billId, String taskId, String userCode) {
        final LambdaQueryWrapper<BillTaskEntity> queryWrapper = Wrappers.lambdaQuery(BillTaskEntity.class);
        queryWrapper.eq(BillTaskEntity::getBillId, billId);
        queryWrapper.eq(BillTaskEntity::getTaskId, taskId);
        queryWrapper.eq(BillTaskEntity::getUserCode, userCode);
        queryWrapper.eq(BillTaskEntity::getTaskType, BillTaskType.ENDORSE.getValue());
        return list(queryWrapper);
    }

    /**
     * 查询当前表单最新的创建任务
     *
     * @param billId 表单id
     * @return 创建节点任务
     */
    @Override
    public BillTaskEntity findCreateTaskByBill(long billId) {

        return baseMapper.selectCreateTaskByBill(billId, NodeLinkType.create.name());
    }

    /**
     * 保存跳过的节点任务
     */
    @Override
    public void saveSkipTask(String taskNodeId, Long billId, String taskId, String taskName, String lastTaskNodeId, String lastTaskId) {
        BillTaskEntity billTask = new BillTaskEntity();
        billTask.setAction(BillAction.none.name());
        billTask.setSort(System.currentTimeMillis());
        billTask.setTaskNodeKey(taskNodeId);
        billTask.setBillId(billId);
        billTask.setTaskType(BillTaskType.SKIP.getValue());
        billTask.setNodeStatus(BillTaskStatus.SKIP.getStatus());
        billTask.setNodeName(taskName);
        billTask.setTaskId(taskId);
        billTask.setDateline(DateTimeUtil.unixTime());
        billTask.setOpinion(Const.SKIP_OPTION);
        billTask.setLastNodeKey(lastTaskNodeId);
        billTask.setLastTaskId(lastTaskId);
        insert(billTask);
    }

    /**
     * 获取当前用户审批中的节点名称
     *
     * @param billId 审批单id
     * @param user   用户
     * @return 节点信息
     */
    @Override
    public List<BillTaskEntity> findApprovingByBillAndUser(long billId, String user) {
        final LambdaQueryWrapper<BillTaskEntity> queryWrapper = Wrappers.lambdaQuery(BillTaskEntity.class)
                .eq(BillTaskEntity::getBillId, billId)
                .eq(BillTaskEntity::getNodeStatus, BillTaskStatus.APPROVAL)
                .eq(BillTaskEntity::getUserCode, user);
        return list(queryWrapper);
    }

    /**
     * 查询审批单已经审批的节点
     *
     * @param billid 审批单id
     * @return 审批节点
     */
    @Override
    public List<BillTaskDTO> getHistoryTasks(Long billid) {
        return this.baseMapper.selectHistoryTasks(billid);
    }

    @Override
    public List<BillTaskEntity> findApprovedByBillAndUser(long billId, String user) {
        final LambdaQueryWrapper<BillTaskEntity> queryWrapper = Wrappers.lambdaQuery(BillTaskEntity.class)
                .eq(BillTaskEntity::getBillId, billId)
                .in(BillTaskEntity::getNodeStatus, BillTaskStatus.AGREE,BillTaskStatus.REFUSE,BillTaskStatus.REPULSE)
                .eq(BillTaskEntity::getUserCode, user);
        return list(queryWrapper);
    }
}

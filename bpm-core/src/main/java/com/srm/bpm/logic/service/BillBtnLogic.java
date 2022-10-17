 

package com.srm.bpm.logic.service;

import com.srm.bpm.infra.entity.BillTaskEntity;
import com.srm.bpm.infra.entity.ToaBillEntity;
import com.srm.bpm.logic.dto.ProcessDetailDTO;

import java.util.List;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface BillBtnLogic {
    /**
     * 根据业务流程 获取 在创建 业务审批单的时候的按钮权限
     *
     * @param process 业务流程
     * @return 审批按钮组
     */
    List<String> findBtnsOnCreateBill(ProcessDetailDTO process);


    /**
     * 根据审批单和审批任务的相关状态来获取审批按钮
     *
     * @param userCode 用户编码
     * @param bill     审批单
     * @param billTask 任务任务
     * @return 审批按钮组
     */
    List<String> findBtnsOnTaskAction(String userCode, ToaBillEntity bill, BillTaskEntity billTask);

    List<String> findBtnsOnReFullIn(long processId);

    /**
     * 当没有审批任务，但是可以查看这个审批单的时候，获取他的审批按钮组
     *
     * @param userCode 员工ID
     * @param bill     审批单
     * @return 审批按钮组
     */
    List<String> findBtnsOnViewBill(String userCode, ToaBillEntity bill);

    /**
     * 根据节点过滤按钮
     *
     * @param billTask 节点任务
     * @param btns     过滤前按钮
     * @return 过滤后按钮
     */
    List<String> filterByNode(BillTaskEntity billTask, List<String> btns);
}



package com.srm.bpm.infra.dao;

import com.srm.bpm.infra.entity.BillTaskEntity;
import com.srm.bpm.infra.po.BillApprovalHistoryPO;
import com.srm.bpm.logic.dto.BillTaskDTO;
import com.srm.common.base.infra.dao.BaseDao;

import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 审批单审批人信息 Mapper 接口
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface BillTaskDao extends BaseDao<BillTaskEntity> {


    void updateByRefullIn(@Param("billId") long billId,
                          @Param("userCode") String userCode,
                          @Param("dateline") int unixTime);

    int selectActiveExcludeSelf(@Param("billId") Long billId,
                                @Param("taskId") String taskId,
                                @Param("id") Long id,@Param("status")Integer status);

    /**
     * 查询节点全部审批任务数量
     *
     * @param billId 审批单id
     * @param taskId 任务id
     * @return 数量
     */
    int selectTotalCount(@Param("billId") Long billId,
                         @Param("taskId") String taskId,
                         @Param("type")int type);

    /**
     * 获取某个审批单的审批历史（排除已撤销的）
     *
     * @param billId 审批单主键
     * @return 审批任务
     */
    List<BillApprovalHistoryPO> selectHistoryByBillId(@Param("billId") long billId);


    List<BillTaskEntity> selectTaskByBillAndUserCode(@Param("billId")long billId, @Param("userCode") String userCode);

    /**
     * 查询当前表单最新的创建任务
     *
     * @param billId 表单id
     * @return 创建节点任务
     */
    BillTaskEntity selectCreateTaskByBill(@Param("billId")long billId,@Param("nodeType") String nodeType);

    /**
     * 查询审批单已经审批的节点
     *
     * @param billid 审批单id
     * @return 审批节点
     */
    List<BillTaskDTO> selectHistoryTasks(@Param("billId")Long billid);

}



package com.srm.bpm.infra.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.bpm.infra.entity.ToaBillEntity;
import com.srm.bpm.logic.query.list.ApprovedBillQuery;
import com.srm.bpm.logic.query.list.CcBillQuery;
import com.srm.bpm.logic.query.list.DraftBillQuery;
import com.srm.bpm.logic.query.list.MeCreateBillQuery;
import com.srm.bpm.logic.query.list.TodoBillQuery;
import com.srm.common.base.infra.service.BaseService;
import com.srm.bpm.infra.po.BillItemPO;
import com.srm.bpm.infra.po.ProcessGridPO;

import java.util.List;

/**
 * <p>
 * 审批单数据 服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface ToaBillService extends BaseService<ToaBillEntity> {

    /**
     * 查询某个员工已审批的审批单
     *
     * @param page     分页参数
     * @param userCode 用户编码
     * @param query    查询条件
     * @return 已审批列表
     */
    List<BillItemPO> findApprovedByEmployee(Page page, String userCode, ApprovedBillQuery query);

    /**
     * 查询我待办的审批单数据
     *
     * @param page     分页参数
     * @param userCode 用户编码
     * @param query    查询条件
     * @return 待办列表
     */
    List<BillItemPO> findTodoByStatus(Page page, String userCode, TodoBillQuery query,
                                      List<Integer> statusList);

    /**
     * 查询获取我发起的审批单数据
     *
     * @param page     分页参数
     * @param userCode 用户编码
     * @param query    查询条件
     * @return 我发起的
     */
    List<BillItemPO> findCreateByEmployee(Page page, String userCode,
                                          MeCreateBillQuery query);

    /**
     * 查询我的草稿
     *
     * @param page     分页参数
     * @param userCode 用户编码
     * @param query    查询
     * @return 草稿列表
     */
    List<BillItemPO> findDraftsBySender(Page page, String userCode, DraftBillQuery query);

    /**
     * 查询抄送我的
     *
     * @param page     分页参数
     * @param userCode 用户编码
     * @param query    查询
     * @return 抄送我的列表
     */
    List<BillItemPO> findCc(Page page, String userCode, CcBillQuery query);

    /**
     * 获取待我审批数量
     *
     * @return 待我审批数量
     */
    String findTodoSizeByStatus(String userCode, List<Integer> statusList);

    List<BillItemPO> findAllByQuery(Page page, DraftBillQuery query);

    List<ProcessGridPO> findTodoCateSize(String userCode, List<Integer> statusList);
}

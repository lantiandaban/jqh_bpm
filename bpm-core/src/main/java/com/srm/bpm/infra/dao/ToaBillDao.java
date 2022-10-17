

package com.srm.bpm.infra.dao;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.bpm.infra.entity.ToaBillEntity;
import com.srm.bpm.logic.query.list.ApprovedBillQuery;
import com.srm.bpm.logic.query.list.CcBillQuery;
import com.srm.bpm.logic.query.list.DraftBillQuery;
import com.srm.bpm.logic.query.list.MeCreateBillQuery;
import com.srm.bpm.logic.query.list.TodoBillQuery;
import com.srm.common.base.infra.dao.BaseDao;
import com.srm.bpm.infra.po.BillItemPO;
import com.srm.bpm.infra.po.ProcessGridPO;

import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 审批单数据 Mapper 接口
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface ToaBillDao extends BaseDao<ToaBillEntity> {

    List<BillItemPO> selectApproverByUserCode(Page page,
                                              @Param("userCode") String userCode,
                                              @Param("query") ApprovedBillQuery query);

    /**
     * 查询某个员工的待办列表
     *
     * @param page     分页参数
     * @param userCode 用户编号
     * @param query    查询条件
     * @param status   待办状态
     * @return 待办列表
     */
    List<BillItemPO> selectTodoByStatus(Page page,
                                        @Param("approver") String userCode,
                                        @Param("query") TodoBillQuery query,
                                        @Param("statusList") List<Integer> status);

    /**
     * 获取我发起的审批
     *
     * @param page     分页参数
     * @param userCode 用户编号
     * @param query    查询条件
     */
    List<BillItemPO> selectCreateByEmployee(Page page,
                                            @Param("userCode") String userCode,
                                            @Param("query") MeCreateBillQuery query);

    /**
     *
     */
    List<BillItemPO> selectDraftsBySender(Page page,
                                          @Param("sender") String userCode,
                                          @Param("query") DraftBillQuery query);

    /**
     * 查询抄送我的
     */
    List<BillItemPO> selectCc(Page page,
                              @Param("userCode") String userCode,
                              @Param("query") CcBillQuery query);

    /**
     * 获取待我审批数量
     *
     * @return 待我审批数量
     */
    String selectTodoSizeByStatus(@Param("approver") String userCode, @Param("statusList") List<Integer> statusList);

    List<BillItemPO> selectAllByQuery( Page page,@Param("query")DraftBillQuery query);

    List<ProcessGridPO> selectTodoCateSiez(@Param("approver") String var1, @Param("statusList") List<Integer> var2);
}

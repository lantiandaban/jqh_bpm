

package com.srm.bpm.infra.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.bpm.logic.query.list.ApprovedBillQuery;
import com.srm.bpm.logic.query.list.CcBillQuery;
import com.srm.bpm.logic.query.list.DraftBillQuery;
import com.srm.bpm.logic.query.list.MeCreateBillQuery;
import com.srm.bpm.logic.query.list.TodoBillQuery;
import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.bpm.infra.dao.ToaBillDao;
import com.srm.bpm.infra.entity.ToaBillEntity;
import com.srm.bpm.infra.po.BillItemPO;
import com.srm.bpm.infra.po.ProcessGridPO;
import com.srm.bpm.infra.service.ToaBillService;

import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 审批单数据 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
public class ToaBillServiceImpl extends BaseServiceImpl<ToaBillDao, ToaBillEntity> implements ToaBillService {

    /**
     * 查询某个员工已审批的审批单
     *
     * @param page     分页参数
     * @param userCode 员工ID
     * @param query    查询条件
     * @return 待办列表
     */
    @Override
    public List<BillItemPO> findApprovedByEmployee(Page page, String userCode, ApprovedBillQuery query) {
        return this.baseMapper.selectApproverByUserCode(page,userCode,query);
    }

    /**
     * 查询我待办的审批单数据
     *
     * @param page     分页参数
     * @param userCode 员工编码
     * @param query    查询条件
     * @return 待办列表
     */
    @Override
    public List<BillItemPO> findTodoByStatus(Page page, String userCode, TodoBillQuery query, List<Integer> statusList) {
        return this.baseMapper.selectTodoByStatus(page,userCode,query,statusList);
    }

    /**
     * 查询获取我发起的审批单数据
     *
     * @param page     分页参数
     * @param userCode 员工编码
     * @param query    查询条件
     * @return 待办列表
     */
    @Override
    public List<BillItemPO> findCreateByEmployee(Page page, String userCode, MeCreateBillQuery query) {
        return this.baseMapper.selectCreateByEmployee(page,userCode,query);
    }

    /**
     * 查询我的草稿
     *
     * @param page     分页参数
     * @param userCode 用户编码
     * @param query    查询
     * @return 草稿列表
     */
    @Override
    public List<BillItemPO> findDraftsBySender(Page page, String userCode, DraftBillQuery query) {
        return this.baseMapper.selectDraftsBySender(page,userCode,query);
    }

    /**
     * 查询抄送我的
     *
     * @param page     分页参数
     * @param userCode 用户编码
     * @param query    查询
     * @return 抄送我的列表
     */
    @Override
    public List<BillItemPO> findCc(Page page, String userCode, CcBillQuery query) {
        return this.baseMapper.selectCc(page,userCode,query);
    }

    /**
     * 获取待我审批数量
     *
     * @return 待我审批数量
     */
    @Override
    public String findTodoSizeByStatus(String userCode, List<Integer> statusList) {
        return this.baseMapper.selectTodoSizeByStatus(userCode,statusList);
    }

    @Override
    public List<BillItemPO> findAllByQuery(Page page, DraftBillQuery query) {
        return this.baseMapper.selectAllByQuery(page,query);
    }

    @Override
    public List<ProcessGridPO> findTodoCateSize(String userCode, List<Integer> statusList) {
        return this.baseMapper.selectTodoCateSiez(userCode,statusList);
    }
}



package com.srm.bpm.logic.service;

import com.srm.bpm.infra.entity.BillTaskEntity;
import com.srm.bpm.infra.po.ProcessDetailPO;
import com.srm.bpm.logic.context.BillDataContext;
import com.srm.bpm.logic.dto.BillActionParamDTO;
import com.srm.bpm.logic.dto.ValidationResultDTO;
import com.srm.bpm.logic.query.list.ApprovedBillQuery;
import com.srm.bpm.logic.query.list.CcBillQuery;
import com.srm.bpm.logic.query.list.DraftBillQuery;
import com.srm.bpm.logic.query.list.MeCreateBillQuery;
import com.srm.bpm.logic.query.list.TodoBillQuery;
import com.srm.bpm.logic.vo.BillApprovalHistoryVO;
import com.srm.bpm.logic.vo.BillDetailVO;
import com.srm.bpm.logic.vo.BillItemVO;
import com.srm.bpm.logic.vo.FormFieldVO;
import com.srm.bpm.logic.vo.ProcessTypeVO;

import org.apache.commons.lang3.tuple.Pair;

import java.util.List;
import java.util.Map;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface BillLogic {
    /**
     * 创建审批单
     *
     * @param processId 业务流程主键
     * @return 审批单数据信息
     */
    BillDetailVO create(long processId);

    /**
     * 通过bill的id查询
     *
     * @param billId 审批单主键
     * @return 审批单信息
     */
    BillDetailVO findBillDetail(long billId, String page);

    /**
     * 通过bill的id查询
     */
    BillDetailVO findBillDetailModeView(long billId, String page);

    /**
     * 设置某个员工已经读取了某个审批单
     *
     * @param billId 审批单ID
     * @return 是否操作成功
     */
    boolean readBill(long billId);

    /**
     * 保存草稿箱
     *
     * @param processId 业务流程
     * @param formData  表单数据
     * @param billId    表单id
     * @param title     标题
     * @param code      编码
     * @return 审批单
     */
    BillItemVO saveDrafts(long processId, long billId, String formData);

    /**
     * 获取我已审批的审批单
     *
     * @param pageNo   当前页
     * @param pageSize 每页数量
     * @param query    查询参数
     * @return 数据和总数
     */
    Pair<List<BillItemVO>, Long> findApproved(Integer pageNo, Integer pageSize, ApprovedBillQuery query);

    /**
     * 获取待我审批的审批单
     *
     * @param pageNo   当前页
     * @param pageSize 每页数量
     * @param query    查询参数
     * @return 数据和总数
     */
    Pair<List<BillItemVO>, Long> findTodo(Integer pageNo, Integer pageSize, TodoBillQuery query);

    /**
     * 获取我发起的审批
     *
     * @param pageNo   当前页
     * @param pageSize 每页数量
     * @param query    查询参数
     * @return 数据和总数
     */
    Pair<List<BillItemVO>, Long> findMeCreate(Integer pageNo, Integer pageSize, MeCreateBillQuery query);

    /**
     * 我的草稿
     *
     * @param pageNo   当前页
     * @param pageSize 每页数量
     * @param query    查询参数
     * @return 数据和总数
     */
    Pair<List<BillItemVO>, Long> findDraft(Integer pageNo, Integer pageSize, DraftBillQuery query);

    /**
     * 抄送我的
     *
     * @param pageNo   当前页
     * @param pageSize 每页数量
     * @param query    查询参数
     * @return 数据和总数
     */
    Pair<List<BillItemVO>, Long> findCc(Integer pageNo, Integer pageSize, CcBillQuery query);

    /**
     * 提交流程
     *
     * @param processId    业务流程
     * @param formData     表单数据
     * @param billId       审批单id
     * @param title        标题
     * @param code         编码
     * @param nextApprover 下一个节点审批人
     * @return 审批单
     */
    BillItemVO startFlow(long processId, long billId, String formData,
                         String nextApprover, String billCode);

    /**
     * 对草稿箱中的审批单进行直接提交
     *
     * @param billId    审批单主键
     * @param processId 业务流程
     * @return 审批单
     */
    BillItemVO sendProcess(long billId, long processId,
                           String nextApprover);


    /**
     * 同意某个审批流程
     *
     * @param actionParam 审批操作参数
     */
    void agreeFlow(BillActionParamDTO actionParam);

    /**
     * 拒绝某个审批流程
     *
     * @param actionParam 审批操作参数
     */
    void refuseFlow(BillActionParamDTO actionParam);

    /**
     * 结束并设置完成审批单
     *
     * @param billId 审批单ID
     */
    void complete(long billId,String action);

    /**
     * 获取某个审批单的审批历史记录
     *
     * @param billId 审批单
     * @return 审批历史记录
     */
    List<BillApprovalHistoryVO> findBillApprovalHistory(long billId);


    /**
     * 撤回审批任务
     * <p>
     * 暂时只实现整体流程结束，并设置为草稿状态
     *
     * @param actionParam 审批操作参数
     */
    void recallFlow(BillActionParamDTO actionParam);

    boolean agreeIsGoOn(BillTaskEntity billTask);

    BillDataContext resolveFormData(long billId, ProcessDetailPO processDetail, Map<String, Object> formDataMap);

    /**
     * 加签操作
     *
     * @param actionParam 审核参数
     */
    void endorse(BillActionParamDTO actionParam);

    /**
     * 打回操作
     *
     * @param actionParam 审核参数
     */
    void repulseFlow(BillActionParamDTO actionParam);

    /**
     * 移交操作
     *
     * @param billId   单据id
     * @param taskId   任务id
     * @param turnUser 移交用户
     * @param userCode 当前审批用户
     */
    void turnUser(long billId, String taskId, String turnUser, String userCode, String opinion);

    /**
     * 手机端创建审批单
     *
     * @param processId 业务流程主键
     * @return 审批单数据信息
     */
    BillDetailVO<List<FormFieldVO>> createByApp(long processId);

    /**
     * 表单验证
     *
     * @param processId 流程id
     * @param billId    审批单id
     * @param formData  表单数据
     * @param userCode  用户编号
     * @return 验证结果
     */
    ValidationResultDTO validation(long processId, long billId, String formData, String userCode);

    /**
     * 获取当前节点的条件
     *
     * @param processId 流程编号
     * @param billId    审批单id
     * @param taskId    节点任务编号
     * @return 节点条件
     */
    List<String> getNodeCondition(long processId, long billId, String taskId);

    /**
     * 获取待我审批数量
     *
     * @return 待我审批数量
     */
    String findTodoSize();


    Pair<List<BillItemVO>, Long> findAllByQuery(Integer pageNo, Integer pageSize, DraftBillQuery query);

    List<ProcessTypeVO> findTodoCateSize();
}

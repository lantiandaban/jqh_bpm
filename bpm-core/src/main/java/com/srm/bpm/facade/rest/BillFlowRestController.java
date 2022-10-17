

package com.srm.bpm.facade.rest;

import com.google.common.base.Strings;
import com.google.common.collect.Maps;

import com.srm.bpm.logic.dto.BillActionParamDTO;
import com.srm.bpm.logic.dto.ValidationResultDTO;
import com.srm.bpm.logic.service.BillLogic;
import com.srm.bpm.logic.service.BillNextNodeLogic;
import com.srm.bpm.logic.service.BillPrintLogic;
import com.srm.bpm.logic.service.LoginUserHolder;
import com.srm.bpm.logic.vo.BillApprovalHistoryVO;
import com.srm.bpm.logic.vo.BillItemVO;
import com.srm.common.data.exception.RbException;
import com.srm.common.data.rest.R;

import org.apache.commons.lang3.tuple.Pair;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;

import static com.srm.bpm.logic.error.BillCode.ENDORSE_CANNOT_SELF;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@RestController
@RequestMapping("/bill/flow/rest")
@RequiredArgsConstructor
public class BillFlowRestController {
    private final BillLogic billLogic;
    private final LoginUserHolder loginUserHolder;
    private final BillNextNodeLogic billNextNodeLogic;
    private final BillPrintLogic billPrintLogic;

    /**
     * 审批操作-保存草稿
     *
     * @param processId 业务流程ID
     * @param formData  业务流程数据
     * @return 响应信息
     */
    @PostMapping("drafts")
    public R drafts(
            @RequestParam("processId") long processId,
            @RequestParam(value = "id", required = false, defaultValue = "0") long billId,
            @RequestParam("formData") String formData
    ) {
        final BillItemVO billItem = this.billLogic.saveDrafts(processId, billId, formData);
        return R.ok(billItem);
    }

    /**
     * 审批操作-提交申请
     *
     * @param processId 业务流程ID
     * @param formData  业务流程数据
     * @return 响应信息
     */
    @PostMapping("submit")
    public R submit(
            @RequestParam("processId") long processId,
            @RequestParam(value = "billId", required = false, defaultValue = "0") long billId,
            @RequestParam("formData") String formData,
            @RequestParam(value = "nextApprover", required = false) String nextApprover
    ) {
        final BillItemVO billItem = billLogic.startFlow(processId, billId, formData, nextApprover,StrUtil.EMPTY);
        return R.ok(billItem);
    }

    /**
     * 从草稿箱直接发送流程
     *
     * @param processId 业务流程id
     * @param billId    审批单id
     * @return 响应信息
     */
    @PostMapping("send")
    public R<BillItemVO> send(
            @RequestParam("processId") long processId,
            @RequestParam(value = "nextApprover", required = false) String nextApprover,
            @RequestParam("billId") long billId
    ) {
        final BillItemVO billItem = this.billLogic.sendProcess(billId, processId, nextApprover);
        return R.ok(billItem);
    }

    /**
     * 审批同意接口
     *
     * @param billId   审批单主键
     * @param taskId   任务主键
     * @param opinion  审批意见
     * @param formData 审批表单信息（可编辑的部分）
     * @return 操作结果
     */
    @PostMapping("agree")
    public R agree(
            @RequestParam(value = "billId") long billId,
            @RequestParam(value = "taskId", defaultValue = "0") String taskId,
            @RequestParam(value = "content") String opinion,
            @RequestParam(value = "nextApprover", required = false) String nextApproverStr,
            @RequestParam(value = "formData", required = false) String formData
    ) {
        if (Strings.isNullOrEmpty(nextApproverStr) || StrUtil.equals(nextApproverStr, "undefined")) {
            nextApproverStr = "0";
        }
        final String userCode = loginUserHolder.getUserCode();
        final BillActionParamDTO actionParam = BillActionParamDTO.builder()
                .billId(billId).userCode(userCode)
                .taskId(taskId).opinion(opinion).formData(formData)
                .nextApprover(nextApproverStr)
                .build();
        this.billLogic.agreeFlow(actionParam);
        return R.empty();
    }

    @PostMapping("turn")
    public R turn(@RequestParam(value = "billId") long billId,
                  @RequestParam(value = "taskId", defaultValue = "0") String taskId,
                  @RequestParam(value = "content", required = false, defaultValue = "") String opinion,
                  @RequestParam(value = "turnUser") String turnUser
    ) {
        final String userCode = loginUserHolder.getUserCode();
        this.billLogic.turnUser(billId, taskId, turnUser, userCode, opinion);
        return R.empty();
    }

    /**
     * 加签处理
     *
     * @param billId             审批单主键
     * @param taskId             任务主键
     * @param opinion            审批意见
     * @param formData           审批表单信息（可编辑的部分）
     * @param endorseApproverStr 加签审批人
     * @return 操作结果
     */
    @PostMapping("endorse")
    public R endorse(
            @RequestParam(value = "billId") long billId,
            @RequestParam(value = "taskId", defaultValue = "0") String taskId,
            @RequestParam(value = "content") String opinion,
            @RequestParam(value = "nextApprover") String endorseApproverStr,
            @RequestParam(value = "formData", required = false) String formData
    ) {
        final String userCode = loginUserHolder.getUserCode();
        if (userCode.equals(endorseApproverStr)) {
            throw new RbException(ENDORSE_CANNOT_SELF);
        }
        final BillActionParamDTO actionParam = BillActionParamDTO.builder()
                .billId(billId).userCode(userCode)
                .taskId(taskId).opinion(opinion).formData(formData)
                .endorseApprover(endorseApproverStr)
                .build();
        this.billLogic.endorse(actionParam);
        return R.empty();
    }


    /**
     * 审批拒绝接口
     *
     * @param billId   审批单主键
     * @param taskId   任务主键
     * @param opinion  审批意见
     * @param formData 审批表单信息（可编辑的部分）
     * @return 操作接口
     */
    @PostMapping("refuse")
    public R refuse(
            @RequestParam(value = "billId") long billId,
            @RequestParam(value = "content") String opinion,
            @RequestParam(value = "taskId", defaultValue = "0") String taskId,
            @RequestParam(value = "formData", required = false) String formData
    ) {
        final String userCode = loginUserHolder.getUserCode();
        final BillActionParamDTO actionParam = BillActionParamDTO.builder()
                .billId(billId).userCode(userCode)
                .taskId(taskId).opinion(opinion).formData(formData)
                .build();
        this.billLogic.refuseFlow(actionParam);
        return R.empty();
    }


    /**
     * 审批打回接口
     *
     * @param billId   审批单主键
     * @param taskId   任务主键
     * @param opinion  审批意见
     * @param formData 审批表单信息（可编辑的部分）
     * @return 操作接口
     */
    @PostMapping("repulse")
    public R repulse(
            @RequestParam(value = "billId") long billId,
            @RequestParam(value = "content") String opinion,
            @RequestParam(value = "taskId", defaultValue = "0") String taskId,
            @RequestParam(value = "targetTaskId", defaultValue = "0") String targetTaskId,
            @RequestParam(value = "nextApprover",defaultValue = "0",required = false) String nextApprover,
            @RequestParam(value = "formData", required = false) String formData
    ) {
        final String userCode = loginUserHolder.getUserCode();
        final BillActionParamDTO actionParam = BillActionParamDTO.builder()
                .billId(billId).userCode(userCode)
                .nextApprover(nextApprover)
                .taskId(taskId).opinion(opinion).formData(formData)
                .targetTaskId(targetTaskId)
                .build();
        this.billLogic.repulseFlow(actionParam);
        return R.empty();
    }

    /**
     * 审批撤回接口
     *
     * @param billId  审批单主键
     * @param taskId  任务主键
     * @param opinion 审批意见
     * @return 操作接口
     */
    @PostMapping("cancel")
    public R cancel(
            @RequestParam(value = "billId") long billId,
            @RequestParam(value = "content") String opinion,
            @RequestParam(value = "taskId", defaultValue = "0") String taskId
    ) {
        final String userCode = loginUserHolder.getUserCode();
        final BillActionParamDTO actionParam = BillActionParamDTO.builder()
                .billId(billId).userCode(userCode)
                .taskId(taskId).opinion(opinion)
                .build();
        this.billLogic.recallFlow(actionParam);
        return R.empty();
    }

    /**
     * 查看某个审批单的审批记录
     *
     * @param billId 审批单
     * @return 审批记录
     */
    @GetMapping("approval/history")
    public R<List<BillApprovalHistoryVO>> approvalHistory(
            @RequestParam(value = "billId") long billId
    ) {
        List<BillApprovalHistoryVO> approvalHistorys = this.billLogic.findBillApprovalHistory(billId);
        return R.ok(approvalHistorys);
    }

    @PostMapping("manual/flag")
    public R manualFlag(@RequestParam(value = "billId") long billId,
                        @RequestParam(value = "taskId", defaultValue = "0") String taskId,
                        @RequestParam(value = "formData", required = false) String formData) {
        final Pair<Integer, String> manualFlag = billNextNodeLogic.approvalNextManualFlag(taskId, billId, formData);
        Map<String, Object> result = Maps.newHashMap();
        result.put("manualFlag", manualFlag.getKey());
        result.put("nodeName", manualFlag.getValue());
        return R.ok(result);
    }

    @PostMapping("manual/flag/submit")
    public R manualSubmitFlag(@RequestParam(value = "processId", defaultValue = "0") Long processId,
                              @RequestParam(value = "formData", required = false) String formData) {
        final String userId = loginUserHolder.getUserCode();
        final Pair<Integer, String> manualFlag = billNextNodeLogic.submitNextManualFlag(processId, userId, formData);
        Map<String, Object> result = Maps.newHashMap();
        result.put("manualFlag", manualFlag.getKey());
        result.put("nodeName", manualFlag.getValue());
        return R.ok(result);
    }


    @GetMapping("/download")
    public void download(@RequestParam("billId") Long billId, HttpServletResponse resp, HttpServletRequest request) {
        billPrintLogic.download(billId, resp, request);
    }

    @GetMapping("/print")
    public R print(@RequestParam("billId") Long billId) {
        return R.ok(billPrintLogic.print(billId));
    }


    /**
     * 验证表单
     *
     * @param processId 业务流程主键
     * @param billId    审批ID
     * @param formData  表单数据
     * @return 响应信息
     */
    @PostMapping("validation")
    public R<ValidationResultDTO> validation(
            @RequestParam("processId") long processId,
            @RequestParam(value = "billId", required = false, defaultValue = "0") long billId,
            @RequestParam("formData") String formData
    ) {
        ValidationResultDTO validationResultDto;
        validationResultDto = billLogic.validation(processId, billId, formData, loginUserHolder.getUserCode());
        return R.ok(validationResultDto);
    }

    @GetMapping("/node/condition")
    public R<List<String>> getNodeCondition(@RequestParam("processId") long processId,
                                            @RequestParam(value = "billId", required = false, defaultValue = "0") long billId,
                                            @RequestParam(value = "taskId", required = true, defaultValue = "0") String taskId) {

        List<String> result = billLogic.getNodeCondition(processId, billId, taskId);
        return R.ok(result);
    }
}

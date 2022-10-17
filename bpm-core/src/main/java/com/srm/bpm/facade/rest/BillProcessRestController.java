

package com.srm.bpm.facade.rest;

import com.google.common.base.Strings;

import com.srm.bpm.logic.service.BillLogic;
import com.srm.bpm.logic.service.LoginUserHolder;
import com.srm.bpm.logic.service.ProcessTypeLogic;
import com.srm.bpm.logic.vo.BillApprovalHistoryVO;
import com.srm.bpm.logic.vo.BillDetailVO;
import com.srm.bpm.logic.vo.ProcessTypeVO;
import com.srm.common.data.rest.R;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/bill/process/rest")
@Api(tags = "发起审批")
public class BillProcessRestController {
    private final ProcessTypeLogic processTypeLogic;
    private final BillLogic billLogic;
    private final LoginUserHolder loginUserHolder;

    /**
     * 获取系统已经开启的业务流程列表接口，连同业务流程类型一起将数据放回
     *
     * @return 业务流程列表
     */
    @ApiOperation(value = "查询可以发起的流程列表", httpMethod = "GET")
    @GetMapping("list/type")
    public R<List<ProcessTypeVO>> listType(String name) {
        final String userCode = loginUserHolder.getUserCode();
        final Set<String> userOrgs = loginUserHolder.getUserOrgs();
        final String bloc = loginUserHolder.getBloc();
        final List<ProcessTypeVO> processTypes = this.processTypeLogic.selectAllWithTypeGroup(userCode, userOrgs,bloc, Strings.isNullOrEmpty(name)?"":name);
        return R.ok(processTypes);
    }

    /**
     * 新建审批单详情
     *
     * @param processId 业务流程主键
     * @return 审批信息
     */
    @GetMapping("create/{processId}")
    public R create(
            @PathVariable("processId") long processId,
            @RequestParam(value ="app",required = false,defaultValue = "0") Integer app
    ) {
        if(app==1){
            final BillDetailVO billDetailVO = billLogic.createByApp(processId);
            return R.ok(billDetailVO);
        }else{
            final BillDetailVO billDetailVO = billLogic.create(processId);
            return R.ok(billDetailVO);
        }

    }

    /**
     * 审批单详情 编辑模式
     * <p>
     * 在 草稿箱和我发起的审批列表中 中 调用这个接口来查看审批单
     *
     * @param billId 业务流程主键
     * @return 审批信息
     */
    @GetMapping("edit/{billId}")
    public R edit(
            @PathVariable("billId") long billId,
            @RequestParam(value = "page", required = false,defaultValue = "edit") String page
    ) {
        final BillDetailVO billDetailVO;
        billDetailVO = billLogic.findBillDetail(billId, page);
        if (null == billDetailVO) {
            return R.empty();
        }

        List<BillApprovalHistoryVO> approvalHistorys = this.billLogic.findBillApprovalHistory(billId);
        billDetailVO.setTrack(approvalHistorys);
        return R.ok(billDetailVO);
    }

    /**
     * 审批表单详情，用于审批操作
     * <p>
     * 在 待我审批和我已审批中 调用这个接口来查看审批单
     *
     * @param billId 业务流程主键
     * @param page   来源界面 比如 草稿箱等
     * @return 审批信息
     */
    @GetMapping("view/{billId}")
    public R view(
            @PathVariable("billId") long billId,
            @RequestParam(value = "page", required = false,defaultValue = "view") String page
    ) {
        final BillDetailVO billDetailVO;
        billDetailVO = billLogic.findBillDetailModeView(billId, page);
        if (null == billDetailVO) {
            return R.empty();
        }
        List<BillApprovalHistoryVO> approvalHistorys = this.billLogic.findBillApprovalHistory(billId);
        billDetailVO.setTrack(approvalHistorys);
        return R.ok(billDetailVO);
    }


    /**
     * 读取某个审批单
     *
     * @param billId 审批单ID
     * @return 是否成功
     */
    @GetMapping("read/{billId}")
    public R read(
            @PathVariable("billId") long billId
    ) {
        boolean readState = billLogic.readBill(billId);
        return R.state(readState);
    }
}

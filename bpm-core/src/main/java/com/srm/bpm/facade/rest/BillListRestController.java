 

package com.srm.bpm.facade.rest;

import com.google.common.base.Strings;

import com.alibaba.fastjson.JSON;
import com.srm.bpm.facde.dto.BillTaskDTO;
import com.srm.bpm.logic.converts.BillBasicConvert;
import com.srm.bpm.logic.query.list.ApprovedBillQuery;
import com.srm.bpm.logic.query.list.CcBillQuery;
import com.srm.bpm.logic.query.list.DraftBillQuery;
import com.srm.bpm.logic.query.list.MeCreateBillQuery;
import com.srm.bpm.logic.query.list.TodoBillQuery;
import com.srm.bpm.logic.service.BillLogic;
import com.srm.bpm.logic.service.BillTaskLogic;
import com.srm.bpm.logic.vo.BillItemVO;
import com.srm.bpm.logic.vo.BillTaskVO;
import com.srm.common.data.rest.R;

import org.apache.commons.lang3.tuple.Pair;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import springfox.documentation.annotations.ApiIgnore;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@RequestMapping("/bill/list/rest")
@RestController
@RequiredArgsConstructor
@Api(tags = "审批单列表")
public class BillListRestController {
    private final BillLogic billLogic;
    private final BillTaskLogic billTaskLogic;
    private final BillBasicConvert billBasicConvert;

    /**
     * 获取我已审批的审批单
     *
     * @return 待我审批列表
     */
    @ApiOperation(value = "分页查询我已审批的审批单", httpMethod = "GET")
    @ApiImplicitParams(
            {
                    @ApiImplicitParam(name = "page", defaultValue = "1"),
                    @ApiImplicitParam(name = "limit", defaultValue = "10"),
                    @ApiImplicitParam(name = "q", value = "查询参数", defaultValue = "")
            })
    @GetMapping("approved")
    public R<List<BillItemVO>> approved(
            @ApiIgnore @RequestParam Map<String, Object> params
    ) {
        final Integer pageNo = Integer.valueOf((String) params.get("page"));
        final Integer pageSize = Integer.valueOf((String) params.get("limit"));
        final String filterText = (String) params.get("q");
        final ApprovedBillQuery query;
        if (!Strings.isNullOrEmpty(filterText)) {
            query = JSON.parseObject(filterText, ApprovedBillQuery.class);
        } else {
            query = new ApprovedBillQuery();
        }
        Pair<List<BillItemVO>, Long> result = billLogic.findApproved(pageNo, pageSize, query);
        return R.ok(result.getKey(), result.getValue());
    }


    /**
     * 获取待我审批的审批单
     *
     * @return 获取待我审批的列表
     */
    @ApiOperation(value = "分页查询待我审批的审批单", httpMethod = "GET")
    @ApiImplicitParams(
            {
                    @ApiImplicitParam(name = "page", defaultValue = "1"),
                    @ApiImplicitParam(name = "limit", defaultValue = "10"),
                    @ApiImplicitParam(name = "q", value = "查询参数", defaultValue = "")
            })
    @GetMapping("/todo")
    public R<List<BillItemVO>> todo(
            @ApiIgnore @RequestParam Map<String, Object> params) {

        final Integer pageNo = Integer.valueOf((String) params.get("page"));
        final Integer pageSize = Integer.valueOf((String) params.get("limit"));
        final String filterText = (String) params.get("q");
        TodoBillQuery query = null;
        if (!Strings.isNullOrEmpty(filterText)) {
            query = JSON.parseObject(filterText, TodoBillQuery.class);
        }
        Pair<List<BillItemVO>, Long> result = billLogic.findTodo(pageNo, pageSize, query);
        return R.ok(result.getKey(), result.getValue());
    }

    /**
     * 获取我发起的审批
     *
     * @return 我发起的列表
     */
    @ApiOperation(value = "分页查询我发起的审批", httpMethod = "GET")
    @ApiImplicitParams(
            {
                    @ApiImplicitParam(name = "page", defaultValue = "1"),
                    @ApiImplicitParam(name = "limit", defaultValue = "10"),
                    @ApiImplicitParam(name = "q", value = "查询参数", defaultValue = "")
            })
    @GetMapping("/minecreate")
    public R<List<BillItemVO>> sended(
            @ApiIgnore @RequestParam Map<String, Object> params) {
        final Integer pageNo = Integer.valueOf((String) params.get("page"));
        final Integer pageSize = Integer.valueOf((String) params.get("limit"));
        final String filterText = (String) params.get("q");

        MeCreateBillQuery billQuery = null;
        if (!Strings.isNullOrEmpty(filterText)) {
            billQuery = JSON.parseObject(filterText, MeCreateBillQuery.class);
        }
        Pair<List<BillItemVO>, Long> result = billLogic.findMeCreate(pageNo, pageSize, billQuery);
        return R.ok(result.getKey(), result.getValue());
    }


    /**
     * 获取我的草稿
     *
     * @return 我的草稿
     */
    @GetMapping("/drafts")
    @ApiOperation(value = "分页查询我的草稿审批", httpMethod = "GET")
    @ApiImplicitParams(
            {
                    @ApiImplicitParam(name = "page", defaultValue = "1"),
                    @ApiImplicitParam(name = "limit", defaultValue = "10"),
                    @ApiImplicitParam(name = "q", value = "查询参数", defaultValue = "")
            })
    public R<List<BillItemVO>> drafts(@ApiIgnore @RequestParam Map<String, Object> params) {

        final Integer pageNo = Integer.valueOf((String) params.get("page"));
        final Integer pageSize = Integer.valueOf((String) params.get("limit"));
        final String filterText = (String) params.get("q");
        DraftBillQuery query = null;
        if (!Strings.isNullOrEmpty(filterText)) {
            query = JSON.parseObject(filterText, DraftBillQuery.class);
        }
        final Pair<List<BillItemVO>, Long> result = billLogic.findDraft(pageNo, pageSize, query);
        return R.ok(result.getKey(), result.getValue());
    }


    /**
     * 抄送我的
     *
     * @return 我的草稿
     */
    @ApiOperation(value = "分页查询抄送我的审批", httpMethod = "GET")
    @ApiImplicitParams(
            {
                    @ApiImplicitParam(name = "page", defaultValue = "1"),
                    @ApiImplicitParam(name = "limit", defaultValue = "10"),
                    @ApiImplicitParam(name = "q", value = "查询参数", defaultValue = "")
            })
    @GetMapping("/cc")
    public R<List<BillItemVO>> cc(@ApiIgnore @RequestParam Map<String, Object> params) {
        final Integer pageNo = Integer.valueOf((String) params.get("page"));
        final Integer pageSize = Integer.valueOf((String) params.get("limit"));
        final String filterText = (String) params.get("q");
        CcBillQuery query = null;
        if (!Strings.isNullOrEmpty(filterText)) {
            query = JSON.parseObject(filterText, CcBillQuery.class);
        }
        final Pair<List<BillItemVO>, Long> result = billLogic.findCc(pageNo, pageSize, query);
        return R.ok(result.getKey(), result.getValue());
    }

    @GetMapping("/history/tasks")
    public R<List<BillTaskDTO>> getHistoryTasks(Long billId) {
        List<BillTaskVO> billTaskVOS = billTaskLogic.getHistoryTasks(billId);
        return R.ok(billBasicConvert.billTaskVOToDTO(billTaskVOS));
    }
    /**
     * 根据查询条件查询审批单信息
     *
     * @return 审批单列表
     */
    @ApiOperation(value = "分页查询审批单", httpMethod = "GET")
    @ApiImplicitParams(
            {
                    @ApiImplicitParam(name = "page", defaultValue = "1"),
                    @ApiImplicitParam(name = "limit", defaultValue = "10"),
                    @ApiImplicitParam(name = "q", value = "查询参数", defaultValue = "")
            })
    @GetMapping("/all/bill")
    public R<List<BillItemVO>> forSelect(@ApiIgnore @RequestParam Map<String, Object> params){
        final Integer pageNo = Integer.valueOf((String) params.get("page"));
        final Integer pageSize = Integer.valueOf((String) params.get("limit"));
        final String filterText = (String) params.get("q");
        DraftBillQuery query = null;
        if (!Strings.isNullOrEmpty(filterText)) {
            query = JSON.parseObject(filterText, DraftBillQuery.class);
        }
        final Pair<List<BillItemVO>, Long> result = billLogic.findAllByQuery(pageNo, pageSize, query);
        return R.ok(result.getKey(), result.getValue());
    }
}

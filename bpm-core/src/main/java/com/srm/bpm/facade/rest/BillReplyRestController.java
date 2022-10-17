 

package com.srm.bpm.facade.rest;

import com.google.common.base.Strings;
import com.google.common.collect.Maps;

import com.srm.bpm.logic.dto.BillReplyDTO;
import com.srm.bpm.logic.service.BillReplyLogic;
import com.srm.common.data.rest.R;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import cn.hutool.core.lang.Pair;
import lombok.RequiredArgsConstructor;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@RestController
@RequestMapping("/bill/reply/rest")
@RequiredArgsConstructor
public class BillReplyRestController {
    private final BillReplyLogic billReplyLogic;

    @GetMapping("/list")
    public R<Map<String, Object>> list(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "billId") Long billId
    ) {
        final Pair<List<BillReplyDTO>, Long> billReplies = billReplyLogic.findByBillId(page, pageSize, billId);
        Map<String, Object> result = Maps.newHashMap();
        result.put("recordsTotal", billReplies.getValue());
        result.put("recordsFiltered", billReplies.getValue());
        result.put("data", billReplies.getKey());
        return R.ok(result);
    }

    @PostMapping("/delete")
    public R delete(
            @RequestParam(value = "replyId") long replyId,
            @RequestParam(value = "billId") long billId
    ) {
        final boolean billReplies = billReplyLogic.deleteByBillId(billId, replyId);
        return R.state(billReplies);
    }

    /**
     * 审批单回复提交
     *
     * @param billId  审批单ID
     * @param content 回复内容
     * @return 响应信息
     */
    @PostMapping("/submit")
    public R<BillReplyDTO> submit(
            @RequestParam(value = "billId") Long billId,
            @RequestParam(value = "content") String content
    ) {
        final BillReplyDTO replyDto = billReplyLogic.submit(billId, content);
        if (Strings.isNullOrEmpty(content)) {
            return R.empty();
        }
        if (replyDto == null) {
            return R.empty();
        }
        return R.ok(replyDto);
    }
}

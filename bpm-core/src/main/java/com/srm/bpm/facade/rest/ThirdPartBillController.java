

package com.srm.bpm.facade.rest;

import com.google.common.base.Strings;

import com.alibaba.fastjson.JSONObject;
import com.srm.bpm.facde.dto.BillItemDTO;
import com.srm.bpm.infra.service.FormThirdItemLogic;
import com.srm.bpm.logic.converts.BillBasicConvert;
import com.srm.bpm.logic.service.BillLogic;
import com.srm.bpm.logic.util.StringUtil;
import com.srm.bpm.logic.vo.BillItemVO;
import com.srm.common.data.rest.R;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@RestController
@RequestMapping("/third/part/bill")
@RequiredArgsConstructor
public class ThirdPartBillController {
    private final FormThirdItemLogic formThirdItemLogic;
    private final BillLogic billLogic;
    private final BillBasicConvert billBasicConvert;

    @PostMapping("/submit")
    public R<BillItemDTO> submitFormData(@RequestBody JSONObject jsonObject) {
        final Long processId = Long.valueOf(StringUtil.ob2str(jsonObject.get("processId")));
        final Long billId = Long.valueOf(StringUtil.ob2str(jsonObject.get("billId")));
        String nextApprover = StringUtil.ob2str(jsonObject.get("nextApprover"));
        String billCode = StringUtil.ob2str(jsonObject.get("billCode"));
        if (Strings.isNullOrEmpty(nextApprover)) {
            nextApprover = "0";
        }
        final String toForm = formThirdItemLogic.analysisToForm(jsonObject.getString("data"), processId);
        final BillItemVO billItem = billLogic.startFlow(processId, billId, toForm, nextApprover,billCode);
        return R.ok(billBasicConvert.billItemVOToDTO(billItem));
    }

    @PostMapping("/save")
    public R<BillItemDTO> saveFormData(@RequestBody JSONObject jsonObject) {
        final Long processId = Long.valueOf(StringUtil.ob2str(jsonObject.get("processId")));
        final Long billId = Long.valueOf(StringUtil.ob2str(jsonObject.get("billId")));
        final String toForm = formThirdItemLogic.analysisToForm(jsonObject.getString("data"), processId);
        final BillItemVO billItem = billLogic.saveDrafts(processId, billId, toForm);
        return R.ok(billBasicConvert.billItemVOToDTO(billItem));
    }

    @PostMapping("/convert")
    public R convert(String data, Long processId) {
        final String toForm = formThirdItemLogic.analysisToForm(data, processId);
        return R.ok(toForm);
    }

}

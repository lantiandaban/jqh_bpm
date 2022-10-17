 

package com.srm.bpm.facade.rest;

import com.google.common.base.Strings;

import com.srm.bpm.infra.po.FormFieldPO;
import com.srm.bpm.infra.service.FormFieldService;
import com.srm.bpm.logic.dto.DatasourceLinkqueryDto;
import com.srm.bpm.logic.service.BillItemAssembleLogic;
import com.srm.bpm.logic.service.BillItemResolveLogic;
import com.srm.bpm.logic.service.DataSourceLogic;
import com.srm.bpm.logic.service.LoginUserHolder;
import com.srm.common.data.rest.R;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/form/rest")
public class RelyController {
    private final FormFieldService formFieldService;
    private final BillItemAssembleLogic billItemAssembleService;
    private final BillItemResolveLogic billItemResolveService;
    private final LoginUserHolder loginUserHolder;
    private final DataSourceLogic dataSourceLogic;

    @PostMapping("rely")
    public R index(
            String fieldValue,
            String table,
            String equalField,
            String correspondField,
            String xtype,
            String field) {
        DatasourceLinkqueryDto datasourceLinkqueryDto = new DatasourceLinkqueryDto();
        datasourceLinkqueryDto.setCorrespondField(correspondField);
        datasourceLinkqueryDto.setFieldValue(fieldValue);
        datasourceLinkqueryDto.setTable(table);
        datasourceLinkqueryDto.setEqualField(equalField);
        datasourceLinkqueryDto.setXtype(xtype);
        datasourceLinkqueryDto.setField(field);
        String widgetName = datasourceLinkqueryDto.getField();
        FormFieldPO formField = formFieldService.findByWidgetName(widgetName);
        if (Strings.isNullOrEmpty(fieldValue)) {
            Object o = billItemAssembleService.firstValue(xtype, StrUtil.EMPTY);
            return R.ok(o);
        }
        if (null == formField) {
            return R.state(false);
        }
        String rxtype = formField.getType();
        String props = formField.getProps();
        String queryValue = datasourceLinkqueryDto.getFieldValue();
        String value = billItemResolveService.firstVale(rxtype, props, queryValue);
        final String quetyTable = datasourceLinkqueryDto.getTable();
        final String dsEqualField = datasourceLinkqueryDto.getEqualField();
        Map<String, Object> result;
        result = dataSourceLogic.execLinkquery(quetyTable, dsEqualField, value, loginUserHolder.getUserCode());
        final String dsCorrespondField = datasourceLinkqueryDto.getCorrespondField();
        String cloumn = String.valueOf(result.get(dsCorrespondField));
        if (!Strings.isNullOrEmpty(cloumn)) {
            final String formType = datasourceLinkqueryDto.getXtype();
            Object o = billItemAssembleService.firstValue(formType, cloumn);
            return R.ok(o);
        } else {
            final String formType = datasourceLinkqueryDto.getXtype();
            Object o = billItemAssembleService.firstValue(formType, cloumn);
            return R.ok(o);
        }
    }


}

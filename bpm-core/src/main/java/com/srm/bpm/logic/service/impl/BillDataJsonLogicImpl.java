

package com.srm.bpm.logic.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.srm.bpm.infra.entity.BillDataJsonEntity;
import com.srm.bpm.infra.entity.FormDesingerEntity;
import com.srm.bpm.infra.service.BillDataJsonService;
import com.srm.bpm.infra.service.FormDesingerService;
import com.srm.bpm.logic.constant.FastJsonType;
import com.srm.bpm.logic.context.BillDataContext;
import com.srm.bpm.logic.service.BillDataJsonLogic;
import com.srm.common.data.exception.RbException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Objects;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static com.alibaba.fastjson.serializer.SerializerFeature.DisableCircularReferenceDetect;
import static com.alibaba.fastjson.serializer.SerializerFeature.WriteMapNullValue;
import static com.srm.bpm.logic.error.BillCode.BILL_DATA_SAVE_ERROR;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BillDataJsonLogicImpl implements BillDataJsonLogic {
    private final BillDataJsonService billDataJsonService;
    private final FormDesingerService formDesingerService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public BillDataJsonEntity saveByBillData(BillDataContext billDataValue, String formDataJSON) {
        long billId = billDataValue.getId();
        long processId = billDataValue.getProcessId();
        // 先移除数据
        final BillDataJsonEntity dbObj = billDataJsonService.getOne(Wrappers.lambdaQuery(BillDataJsonEntity.class).eq(BillDataJsonEntity::getBillId, billId));
        final FormDesingerEntity formDesinger = formDesingerService.getByProcessId(processId);
        final BillDataJsonEntity dataJson = new BillDataJsonEntity();
        dataJson.setFormData(formDataJSON);
        dataJson.setFormSchema(formDesinger.getDesingerJson());
        dataJson.setBillId(billId);
        dataJson.setOutline(billDataValue.getOutline());
        dataJson.setAssociated(billDataValue.getAssociated());
        if (!Objects.isNull(dbObj)) {
            dataJson.setId(dbObj.getId());
        }
        final boolean insertState = Objects.isNull(dbObj) ? billDataJsonService.save(dataJson) : billDataJsonService.upldate(dataJson);
        if (!insertState) {
            throw new RbException(BILL_DATA_SAVE_ERROR);
        }
        return dataJson;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateByBillId(long billId, Map<String, Object> dataMap) {
        BillDataJsonEntity dataJson = billDataJsonService.getOne(Wrappers.lambdaQuery(BillDataJsonEntity.class).eq(BillDataJsonEntity::getBillId, billId));
        final String dbFormData = dataJson.getFormData();
        log.debug("the bill {} formdata is {}", billId, dbFormData);
        // 数据库中已存在的数据
        final Map<String, Object> dbDataMap;
        dbDataMap = JSON.parseObject(dbFormData, FastJsonType.MAP_OBJECT_TR);

        for (String dataKey : dataMap.keySet()) {
            dbDataMap.put(dataKey, dataMap.get(dataKey));
        }
        final String formData = JSON.toJSONString(dbDataMap, DisableCircularReferenceDetect, WriteMapNullValue);
        dataJson.setFormData(formData);

        log.debug("the bill {} update aft formdata is {}", billId, formData);
        return billDataJsonService.upldate(dataJson);
    }
}

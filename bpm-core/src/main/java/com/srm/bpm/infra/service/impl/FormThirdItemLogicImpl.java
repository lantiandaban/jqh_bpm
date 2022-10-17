

package com.srm.bpm.infra.service.impl;

import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.srm.bpm.infra.entity.FormThirdEntity;
import com.srm.bpm.infra.entity.FormThirdItemEntity;
import com.srm.bpm.infra.entity.ToaFormEntity;
import com.srm.bpm.infra.po.FormFieldPO;
import com.srm.bpm.infra.service.FormFieldService;
import com.srm.bpm.infra.service.FormThirdItemLogic;
import com.srm.bpm.infra.service.FormThirdItemService;
import com.srm.bpm.infra.service.FormThirdService;
import com.srm.bpm.infra.service.ToaFormService;
import com.srm.bpm.logic.converts.FormBasicConvert;
import com.srm.bpm.logic.dto.FormThirdDTO;
import com.srm.bpm.logic.dto.FormThirdItemDTO;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.NumberUtil;
import lombok.RequiredArgsConstructor;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Service
@RequiredArgsConstructor
public class FormThirdItemLogicImpl implements FormThirdItemLogic {
    private final FormThirdService formThirdService;
    private final FormThirdItemService formThirdItemService;
    private final ToaFormService formService;
    private final FormFieldService formFieldService;
    private final FormBasicConvert formBasicConvert;

    @Override
    public String analysisToForm(String dataStr, Long processId) {
        final JSONObject data = JSON.parseObject(dataStr);
        List<FormThirdItemEntity> thirdItemList = formThirdItemService.findItemsByProcessId(processId);
        final Map<String, Object> dataMap = Maps.newConcurrentMap();
        if (CollectionUtil.isEmpty(thirdItemList)) {
            return JSON.toJSONString(dataMap);
        }
        final Map<String, String> map =
                thirdItemList.stream().collect(Collectors.toMap(FormThirdItemEntity::getThirdKey, FormThirdItemEntity::getFormFiled));

        for (String s : data.keySet()) {
            final Object o = data.get(s);
            final String key = map.get(s);
            if (Strings.isNullOrEmpty(key)) {
                continue;
            }
            if (o instanceof JSONArray) {
                List<Map<String, Object>> items = Lists.newArrayList();
                JSONArray tmp = (JSONArray) o;
                for (Object o1 : tmp) {
                    Map<String, Object> ttt = Maps.newConcurrentMap();
                    JSONObject tt = (JSONObject) o1;
                    for (String s1 : tt.keySet()) {
                        final String key1 = map.get(s1);
                        if (Strings.isNullOrEmpty(key1)) {
                            continue;
                        }
                        final Object value = tt.get(s1);
                        if (NumberUtil.isNumber(value.toString())) {
                            ttt.put(key1, NumberUtil.toBigDecimal(value.toString()));
                        } else {
                            ttt.put(key1, value);
                        }
                    }
                    items.add(ttt);
                }
                dataMap.put(key, items);
            } else {
                if (NumberUtil.isNumber(o.toString())) {
                    dataMap.put(key, NumberUtil.toBigDecimal(o.toString()));
                } else {
                    dataMap.put(key, o);
                }
            }
        }
        return JSON.toJSONString(dataMap);
    }

    @Override
    public List<FormThirdItemDTO> findByProcessId(Long processId) {
        final ToaFormEntity formEntity = formService.getOne(Wrappers.lambdaQuery(ToaFormEntity.class).eq(ToaFormEntity::getProcessId, processId));
        final Long formId = formEntity.getId();
        final FormThirdEntity formThirdEntity = formThirdService.getOne(Wrappers.lambdaQuery(FormThirdEntity.class).eq(FormThirdEntity::getFormId, formId));
        final List<FormFieldPO> poByFormId = formFieldService.findPOByFormId(formId);
        if (Objects.isNull(formThirdEntity)) {
            List<FormThirdItemDTO> result = Lists.newArrayList();
            for (FormFieldPO formFieldPO : poByFormId) {
                FormThirdItemDTO formThirdItemDTO = new FormThirdItemDTO();
                formThirdItemDTO.setFormFiled(formFieldPO.getWidgetName());
                formThirdItemDTO.setName(formFieldPO.getTitle());
                result.add(formThirdItemDTO);
                final List<FormFieldPO> detailFields = formFieldPO.getDetailFields();
                if (CollectionUtil.isNotEmpty(detailFields)) {
                    for (FormFieldPO detailField : detailFields) {
                        FormThirdItemDTO formThirdItemDTO1 = new FormThirdItemDTO();
                        formThirdItemDTO1.setFormFiled(detailField.getWidgetName());
                        formThirdItemDTO1.setName(formFieldPO.getTitle() + "-明细-" + detailField.getTitle());
                        result.add(formThirdItemDTO1);
                    }
                }
            }
            return result;
        } else {
            final List<FormThirdItemEntity> itemsByProcessId = formThirdItemService.findItemsByProcessId(processId);
            final Map<String, FormThirdItemEntity> configMap = itemsByProcessId.stream().collect(Collectors.toMap(FormThirdItemEntity::getFormFiled, a -> a, (a, b) -> a));
            List<FormThirdItemDTO> result = Lists.newArrayList();
            for (FormFieldPO formFieldPO : poByFormId) {
                FormThirdItemDTO formThirdItemDTO = new FormThirdItemDTO();
                final String widgetName = formFieldPO.getWidgetName();
                formThirdItemDTO.setFormFiled(widgetName);
                formThirdItemDTO.setName(formFieldPO.getTitle());
                final FormThirdItemEntity formThirdItemEntity = configMap.get(widgetName);
                if (!Objects.isNull(formThirdItemEntity)) {
                    formThirdItemDTO.setThirdKey(formThirdItemEntity.getThirdKey());
                }
                result.add(formThirdItemDTO);
                final List<FormFieldPO> detailFields = formFieldPO.getDetailFields();
                if (CollectionUtil.isNotEmpty(detailFields)) {
                    for (FormFieldPO detailField : detailFields) {
                        FormThirdItemDTO formThirdItemDTO1 = new FormThirdItemDTO();
                        formThirdItemDTO1.setFormFiled(detailField.getWidgetName());
                        formThirdItemDTO1.setName(formFieldPO.getTitle() + "-明细-" + detailField.getTitle());
                        final FormThirdItemEntity formThirdItemEntity1 = configMap.get(detailField.getWidgetName());
                        if (!Objects.isNull(formThirdItemEntity1)) {
                            formThirdItemDTO1.setThirdKey(formThirdItemEntity1.getThirdKey());
                        }
                        result.add(formThirdItemDTO1);
                    }
                }
            }
            return result;
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void save(FormThirdDTO formThirdDTO) {
        final ToaFormEntity formEntity = formService.getOne(Wrappers.lambdaQuery(ToaFormEntity.class).eq(ToaFormEntity::getProcessId, formThirdDTO.getProcessId()));
        final Long formId = formEntity.getId();
        final LambdaQueryWrapper<FormThirdEntity> thirdEntityLambdaQueryWrapper = Wrappers.lambdaQuery(FormThirdEntity.class).eq(FormThirdEntity::getFormId, formId);
        FormThirdEntity one = formThirdService.getOne(thirdEntityLambdaQueryWrapper);
        if (!Objects.isNull(one)) {
            final Long id = one.getId();
            formThirdService.physicalDeleteById(id);
            formThirdItemService.physicalDeleteByThirdId(id);
        }
        final List<FormThirdItemDTO> itemDTOS = formThirdDTO.getItemDTOS();
        final List<FormThirdItemEntity> formThirdItemEntities = formBasicConvert.formThirdItemDTOToEntity(itemDTOS);
        one = new FormThirdEntity();
        one.setFormId(formId);
        one.setName(formEntity.getName());
        one.setId(IdWorker.getId());
        formThirdService.save(one);
        List<FormThirdItemEntity> insertLists = Lists.newArrayList();
        for (FormThirdItemEntity formThirdItemEntity : formThirdItemEntities) {
            formThirdItemEntity.setThirdId(one.getId());
            if (!Strings.isNullOrEmpty(formThirdItemEntity.getThirdKey())) {
                insertLists.add(formThirdItemEntity);
            }
        }
        if (CollectionUtil.isNotEmpty(insertLists)) {
            formThirdItemService.saveBatch(insertLists);
        }
    }
}

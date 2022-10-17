 

package com.srm.bpm.infra.service.impl;

import com.google.common.collect.Lists;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.srm.bpm.infra.dao.FormDetailSettingDao;
import com.srm.bpm.infra.entity.FormDetailSettingEntity;
import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.bpm.infra.entity.ToaFormEntity;
import com.srm.bpm.infra.service.FormDetailSettingService;
import com.srm.bpm.logic.dto.ColumnMappingDto;
import com.srm.bpm.logic.vo.DetailTemplateVo;
import com.srm.bpm.logic.error.BillCode;
import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.common.data.exception.RbException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * <p>
 * 表单明细配置 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
public class FormDetailSettingServiceImpl extends BaseServiceImpl<FormDetailSettingDao, FormDetailSettingEntity> implements FormDetailSettingService {

    /**
     * 根据表单的配置和明细的字段的处理
     *
     * @param detailFields 明细字段
     * @param form         表单信息
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createDetailSetting(List<FormFieldEntity> detailFields, ToaFormEntity form) {
        long formId = form.getId();
        final long processId = form.getProcessId();
        DetailTemplateVo detailTemplateVo = new DetailTemplateVo();
        detailTemplateVo.setFileName(form.getCode());
        detailTemplateVo.setProcessId(processId);
        detailTemplateVo.setDetailFields(detailFields);
        List<ColumnMappingDto> columnMappings = Lists.newArrayList();
        for (FormFieldEntity formField : detailFields) {
            final ColumnMappingDto columnMappingDto = new ColumnMappingDto();
            columnMappingDto.setFiled(formField.getWidgetName());
            columnMappingDto.setType(formField.getType());
            columnMappings.add(columnMappingDto);
        }
        FormDetailSettingEntity formDetailSetting =
                getOne(Wrappers.lambdaQuery(FormDetailSettingEntity.class)
                        .eq(FormDetailSettingEntity::getProcessId, processId));
        if (formDetailSetting == null) {
            formDetailSetting = new FormDetailSettingEntity();
            formDetailSetting.setFormId(formId);
            formDetailSetting.setProcessId(processId);
            formDetailSetting.setColumnMapping(JSON.toJSONString(columnMappings));
            final boolean res = this.insert(formDetailSetting);
            if (!res) {
                throw new RbException(BillCode.BILL_DETAILL_SAVE_ERROR);
            }
        } else {
            formDetailSetting.setColumnMapping(JSON.toJSONString(columnMappings));
            final boolean res = this.updateById(formDetailSetting);
            if (!res) {
                throw new RbException(BillCode.BILL_DETAILL_SAVE_ERROR);
            }
        }
    }
}

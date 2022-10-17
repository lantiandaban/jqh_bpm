

package com.srm.bpm.infra.service.impl;

import com.google.common.base.MoreObjects;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.srm.bpm.logic.converts.FormBasicConvert;
import com.srm.bpm.logic.define.FormXtype;
import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.bpm.infra.dao.FormFieldDao;
import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.bpm.infra.po.FormFieldPO;
import com.srm.bpm.infra.service.FormFieldService;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import cn.hutool.core.collection.CollectionUtil;
import lombok.RequiredArgsConstructor;

/**
 * <p>
 * 表单字段 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
@RequiredArgsConstructor
public class FormFieldServiceImpl extends BaseServiceImpl<FormFieldDao, FormFieldEntity> implements FormFieldService {
    private final FormBasicConvert formBasicConvert;
    /**
     * 获取某个业务流程表单中指定类型的字段
     *
     * @param processId 业务流程主键
     * @param xtype     表单控件类型
     * @return 字段列表
     */
    @Override
    public List<FormFieldEntity> findBizFiled(long processId, FormXtype xtype) {
        if (processId <= 0) {
            return null;
        }
        return this.baseMapper.selectByProcessIdAndXtype(processId, xtype.name());
    }

    /**
     * 通过流程ID获取表单字段信息
     *
     * @param processId 流程id
     * @return 表单信息
     */
    @Override
    public List<FormFieldPO> findVoByProcessId(long processId) {
        if (processId <= 0) {
            return Collections.emptyList();
        }
        final List<FormFieldEntity> fields = this.baseMapper.selectByProcessId(processId);
        if (CollectionUtil.isEmpty(fields)) {
            return Collections.emptyList();
        }

        return convertVO(fields);
    }

    /**
     * 通过表单ID获取表单字段信息
     *
     * @param formId 表单ID
     * @return 表单信息
     */
    @Override
    public List<FormFieldPO> findPOByFormId(long formId) {
        if (formId <= 0) {
            return Collections.emptyList();
        }
        final List<FormFieldEntity> fields = this.list(Wrappers.lambdaQuery(FormFieldEntity.class).eq(FormFieldEntity::getFormId, formId)
                .orderByAsc(FormFieldEntity::getFieldId).orderByAsc(FormFieldEntity::getSort));
        if (CollectionUtil.isEmpty(fields)) {
            return Collections.emptyList();
        }

        return convertVO(fields);
    }

    @Override
    public FormFieldPO findByWidgetName(String widgetName) {
        final Optional<FormFieldEntity> unique = unique(Wrappers.lambdaQuery(FormFieldEntity.class).eq(FormFieldEntity::getWidgetName, widgetName));
        if(unique.isPresent()){
            return formBasicConvert.formFieldEntityToPO(unique.get());
        }
        return null;
    }

    /**
     * 将数据库表单字段配置 调整映射为VO配置
     *
     * @param fields 字段信息
     * @return 字段VO
     */
    private List<FormFieldPO> convertVO(List<FormFieldEntity> fields) {
        final List<FormFieldPO> fieldVOS = Lists.newArrayListWithCapacity(fields.size());
        Map<Long, FormFieldPO> detailGroup = Maps.newHashMap();
        for (FormFieldEntity field : fields) {
            final String type = field.getType();
            final Long id = field.getId();

            final FormFieldPO formFieldVO = new FormFieldPO();
            formFieldVO.setId(id);
            formFieldVO.setWidgetName(field.getWidgetName());
            formFieldVO.setTitle(field.getTitle());
            formFieldVO.setType(type);
            formFieldVO.setDescription(field.getDescription());
            formFieldVO.setFormId(field.getFormId());
            formFieldVO.setPlaceholder(field.getPlaceholder());
            formFieldVO.setDatasourceCode(field.getDatasourceCode());
            formFieldVO.setBizType(field.getBizType());
            formFieldVO.setSort(field.getSort());
            final String props = field.getProps();
            final Map map = JSON.parseObject(props, Map.class);
            final Object widget = map.get("widget");
            if (widget != null) {
                formFieldVO.setProps(JSON.toJSONString(widget));
            } else {
                formFieldVO.setProps(field.getProps());
            }
            formFieldVO.setRequired(field.getRequired());
            List<FormFieldPO> formFieldVOS = Lists.newArrayList();
            formFieldVO.setDetailFields(formFieldVOS);

            if (StringUtils.equals(type, FormXtype.detailgroup.name())) {
                detailGroup.put(id, formFieldVO);
            }
            final long fieldId = MoreObjects.firstNonNull(field.getFieldId(), 0L);
            if (fieldId > 0) {
                final FormFieldPO detailGroupField = detailGroup.get(fieldId);
                detailGroupField.getDetailFields().add(formFieldVO);
            } else {
                fieldVOS.add(formFieldVO);
            }
        }
        return fieldVOS;
    }
}

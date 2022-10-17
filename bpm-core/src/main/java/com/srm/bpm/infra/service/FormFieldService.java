

package com.srm.bpm.infra.service;

import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.bpm.logic.define.FormXtype;
import com.srm.common.base.infra.service.BaseService;
import com.srm.bpm.infra.po.FormFieldPO;

import java.util.List;

/**
 * <p>
 * 表单字段 服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface FormFieldService extends BaseService<FormFieldEntity> {

    /**
     * 获取某个业务流程表单中指定类型的字段
     *
     * @param processId 业务流程主键
     * @param xtype     表单控件类型
     * @return 字段列表
     */
    List<FormFieldEntity> findBizFiled(long processId, FormXtype xtype);

    /**
     * 通过流程ID获取表单字段信息
     *
     * @param processId 流程id
     * @return 表单信息
     */
    List<FormFieldPO> findVoByProcessId(long processId);

    /**
     * 通过表单ID获取表单字段信息
     *
     * @param formId 表单ID
     * @return 表单信息
     */
    List<FormFieldPO> findPOByFormId(long formId);

    FormFieldPO findByWidgetName(String widgetName);
}

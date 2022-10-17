

package com.srm.bpm.infra.service;

import java.util.List;

import com.srm.bpm.infra.entity.FormDetailSettingEntity;
import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.common.base.infra.service.BaseService;
import com.srm.bpm.infra.entity.ToaFormEntity;

/**
 * <p>
 * 表单明细配置 服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface FormDetailSettingService extends BaseService<FormDetailSettingEntity> {

    /**
     * 根据表单的配置和明细的字段的处理
     *
     * @param detailFields 明细字段
     * @param form         表单信息
     */
    void createDetailSetting(List<FormFieldEntity> detailFields, ToaFormEntity form);
}

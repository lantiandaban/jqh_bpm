

package com.srm.bpm.infra.service;

import com.srm.bpm.infra.entity.FormSettingEntity;
import com.srm.common.base.infra.service.BaseService;

import java.util.Optional;

/**
 * <p>
 * 表单设置 服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface FormSettingService extends BaseService<FormSettingEntity> {

    Optional<FormSettingEntity> findByFormId(Long id);

    FormSettingEntity findByProcess(long processId);

    String getPrintTmp(Long processId);
}

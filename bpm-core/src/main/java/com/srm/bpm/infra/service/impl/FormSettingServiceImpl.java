

package com.srm.bpm.infra.service.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.bpm.infra.dao.FormSettingDao;
import com.srm.bpm.infra.entity.FormSettingEntity;
import com.srm.bpm.infra.service.FormSettingService;
import com.srm.config.BpmConfig;

import org.springframework.stereotype.Service;

import java.io.File;
import java.util.Objects;
import java.util.Optional;

import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;

/**
 * <p>
 * 表单设置 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
@RequiredArgsConstructor
public class FormSettingServiceImpl extends BaseServiceImpl<FormSettingDao, FormSettingEntity> implements FormSettingService {
    private final BpmConfig bpmConfig;

    @Override
    public Optional<FormSettingEntity> findByFormId(Long id) {
        return this.unique(Wrappers.lambdaQuery(FormSettingEntity.class).eq(FormSettingEntity::getFormId, id));
    }

    @Override
    public FormSettingEntity findByProcess(long processId) {
        return this.baseMapper.selectByProcess(processId);
    }

    @Override
    public String getPrintTmp(Long processId) {
        final FormSettingEntity byProcess = this.findByProcess(processId);
        if (Objects.isNull(byProcess)) {
            return StrUtil.EMPTY;
        }
        return bpmConfig.getFilePath() + File.separator + byProcess.getPrintTemplatePath();
    }
}

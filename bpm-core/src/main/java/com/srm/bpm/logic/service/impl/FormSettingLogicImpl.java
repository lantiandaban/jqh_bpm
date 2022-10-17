

package com.srm.bpm.logic.service.impl;

import com.google.common.io.Files;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.srm.bpm.infra.entity.FormSettingEntity;
import com.srm.bpm.infra.entity.ToaFormEntity;
import com.srm.bpm.infra.entity.ToaProcessEntity;
import com.srm.bpm.infra.service.FormSettingService;
import com.srm.bpm.infra.service.ToaFormService;
import com.srm.bpm.infra.service.ToaProcessService;
import com.srm.bpm.logic.service.FormSettingLogic;
import com.srm.bpm.logic.util.DateToStringUtil;
import com.srm.config.BpmConfig;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

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
@Service
public class FormSettingLogicImpl implements FormSettingLogic {
    private final ToaFormService formService;
    private final FormSettingService formSettingService;
    private final BpmConfig bpmConfig;
    private final ToaProcessService processService;

    @Override
    public boolean updatePrintTemp(Long processId, MultipartFile file) {
        File tempFile;
        String fileType = Files.getFileExtension(file.getOriginalFilename());
        final String newFileName = IdWorker.get32UUID() + StrUtil.DOT + fileType;
        final String dateStr = DateToStringUtil.yyyymmdashNow();
        final String replace = dateStr.replace("-", File.separator);
        final String relativePath = replace + File.separator + newFileName;
        final String resultPath = bpmConfig.getFilePath() + File.separator + relativePath;
        tempFile = new File(resultPath);
        try {
            Files.createParentDirs(tempFile);
            file.transferTo(tempFile);
        } catch (IOException e) {
            e.printStackTrace();
        }
        final Optional<ToaFormEntity> unique = formService.unique(Wrappers.lambdaQuery(ToaFormEntity.class).eq(ToaFormEntity::getProcessId, processId));
        if (unique.isPresent()) {
            final ToaFormEntity toaFormEntity = unique.get();
            final Optional<FormSettingEntity> unique1 = formSettingService.findByFormId(toaFormEntity.getId());
            final FormSettingEntity formSettingEntity;
            if (unique1.isPresent()) {
                formSettingEntity = unique1.get();
                formSettingEntity.setUpdateTime(LocalDateTime.now());
            } else {
                formSettingEntity = new FormSettingEntity();
                formSettingEntity.setCreationTime(LocalDateTime.now());
                formSettingEntity.setFormId(toaFormEntity.getId());
            }
            formSettingEntity.setPrintTemplatePath(relativePath);
            formSettingEntity.setPrintTemplateUrl(relativePath);
            return formSettingService.saveOrUpdate(formSettingEntity);
        }
        return false;
    }

    @Override
    public boolean updateFormLink(long processId, String formLink, String approveLink, Integer manualStartFlag) {
        final Optional<ToaFormEntity> unique = formService.unique(Wrappers.lambdaQuery(ToaFormEntity.class).eq(ToaFormEntity::getProcessId, processId));
        if (unique.isPresent()) {
            final ToaFormEntity toaFormEntity = unique.get();
            final Optional<FormSettingEntity> unique1 = formSettingService.findByFormId(toaFormEntity.getId());
            final FormSettingEntity formSettingEntity;
            if (unique1.isPresent()) {
                formSettingEntity = unique1.get();
                formSettingEntity.setUpdateTime(LocalDateTime.now());
            } else {
                formSettingEntity = new FormSettingEntity();
                formSettingEntity.setCreationTime(LocalDateTime.now());
                formSettingEntity.setFormId(toaFormEntity.getId());
            }
            formSettingEntity.setFormLink(formLink);
            formSettingEntity.setApproveLink(approveLink);
            processService.update(Wrappers.lambdaUpdate(ToaProcessEntity.class)
                    .set(ToaProcessEntity::getAssistant, manualStartFlag)
                    .eq(ToaProcessEntity::getId, processId));
            return formSettingService.saveOrUpdate(formSettingEntity);
        }
        return false;
    }
}

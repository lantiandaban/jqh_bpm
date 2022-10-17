

package com.srm.bpmserver.logic.impl;

import com.google.common.io.Files;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.srm.bpm.logic.dto.AttachmentDTO;
import com.srm.bpm.logic.service.FileUploadLogic;
import com.srm.bpmserver.infra.entity.AttachmentEntity;
import com.srm.bpmserver.infra.service.AttachmentService;
import com.srm.config.BpmConfig;
import com.srm.common.data.exception.RbException;

import org.joda.time.DateTime;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.StrUtil;
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
public class FileUploadLogicImpl implements FileUploadLogic {
    private final AttachmentService attachmentService;
    private final BpmConfig bpmConfig;

    @Override
    public AttachmentDTO upload(MultipartFile file) {
        File tempFile;
        String fileType = Files.getFileExtension(file.getOriginalFilename());
        final String newFileName = IdWorker.get32UUID() + StrUtil.DOT + fileType;
        final String dateStr = DateTime.now().toString("yyyy-MM-dd");
        final String replace = dateStr.replace("-", File.separator);
        final String relativePath = replace + File.separator + newFileName;
        final String resultPath = bpmConfig.getFilePath() + File.separator + relativePath;
        final String originalFilename = file.getOriginalFilename();
        tempFile = new File(resultPath);
        try {
            Files.createParentDirs(tempFile);
            file.transferTo(tempFile);
            AttachmentEntity attachmentEntity = new AttachmentEntity();
            attachmentEntity.setId(IdWorker.getId());
            attachmentEntity.setFilePath(relativePath);
            attachmentEntity.setFileName(originalFilename);
            attachmentEntity.setFileType(fileType);
            attachmentEntity.setFileSize(FileUtil.size(tempFile));
            attachmentService.insert(attachmentEntity);
            return convertDTO(attachmentEntity);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    private AttachmentDTO convertDTO(AttachmentEntity attachmentEntity) {
        AttachmentDTO attachmentDTO = new AttachmentDTO();
        attachmentDTO.setId(attachmentEntity.getId());
        attachmentDTO.setSize(attachmentEntity.getFileSize());
        attachmentDTO.setUrl(attachmentEntity.getId() + "");
        attachmentDTO.setName(attachmentEntity.getFileName());
        attachmentDTO.setType(attachmentEntity.getFileType());
        attachmentDTO.setPath(attachmentEntity.getFilePath());
        return attachmentDTO;
    }

    @Override
    public InputStream download(Long id) {
        final AttachmentEntity byId = attachmentService.getById(id);
        if (Objects.isNull(byId)) {
            throw new RbException("附件不存在");
        }
        final String filePath = bpmConfig.getFilePath();
        try {
            InputStream is = new FileInputStream(filePath + File.separator + byId.getFilePath());
            return is;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public AttachmentDTO getFileInfo(Long id) {
        final AttachmentEntity byId = attachmentService.getById(id);
        return convertDTO(byId);
    }
}

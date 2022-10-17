

package com.srm.bpm.logic.service;

import com.srm.bpm.logic.dto.AttachmentDTO;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface FileUploadLogic {
    AttachmentDTO upload(MultipartFile var1);

    InputStream download(Long id);

    AttachmentDTO getFileInfo(Long id);
}

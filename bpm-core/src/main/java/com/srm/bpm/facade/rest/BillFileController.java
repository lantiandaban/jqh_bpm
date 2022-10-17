

package com.srm.bpm.facade.rest;

import com.google.common.collect.Maps;

import com.srm.bpm.logic.dto.AttachmentDTO;
import com.srm.bpm.logic.service.FileUploadLogic;
import com.srm.common.data.rest.R;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.Objects;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@RestController
@RequestMapping("/bill/file/rest")
@RequiredArgsConstructor
public class BillFileController {
    private final FileUploadLogic fileUploadLogic;

    @PostMapping("/upload")
    public R upload(@RequestParam("file") MultipartFile var1) {
        final AttachmentDTO data = fileUploadLogic.upload(var1);
        if (!Objects.isNull(data)) {
            Map<String, Object> result = Maps.newHashMap();
            result.put("fileName", data.getName());
            result.put("filePath", data.getUrl());
            result.put("fileSize", data.getSize());
            result.put("id", data.getId());
            result.put("fileType", data.getType());
            result.put("url", data.getId());
            return R.ok(result);
        }
        return R.empty();
    }

    @GetMapping("/download/{id}")
    public void download(@PathVariable(value = "id") Long id, HttpServletResponse resp) {
        InputStream inputStream = fileUploadLogic.download(id);
        String fileName = "未知名称";
        try {
            final AttachmentDTO fileInfo = fileUploadLogic.getFileInfo(id);
            if (!Objects.isNull(fileInfo)) {
                fileName = fileInfo.getName();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            String filename = new String(fileName.getBytes("UTF-8"), "iso-8859-1");
            resp.setHeader("Content-Disposition", "attachment;filename=" + filename);
            ServletOutputStream servletOutputStream = resp.getOutputStream();
            int len;
            byte[] buffer = new byte[1024];
            while ((len = inputStream.read(buffer)) > 0) {
                servletOutputStream.write(buffer, 0, len);
            }
            servletOutputStream.flush();
            inputStream.close();
            servletOutputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

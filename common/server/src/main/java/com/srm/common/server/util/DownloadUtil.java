

package com.srm.common.server.util;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
public class DownloadUtil {
    /**
     * DownloadUtil's Logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(DownloadUtil.class);
    private static final String FIREFOX_AGENT = "firefox";
    private static final String SAFARI_AGENT = "safari";

    public static void downloadExcel(HttpServletResponse response, String fileName, Workbook workbook) throws IOException {
        response.reset();
        response.setContentType("application/force-download");// 设置强制下载不打开            
        OutputStream os = null;
        try {
            fileName = fileName +".xlsx";
            String fileNameURL = java.net.URLEncoder.encode(fileName, "UTF-8");
            response.addHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + fileNameURL + ";" + "filename*=utf-8''" + fileNameURL);
            os = response.getOutputStream();
            workbook.write(os);
            os.flush();
        } catch (UnsupportedEncodingException e) {
            LOGGER.error("file name encoding has error!" + e);
        } finally {
            IOUtils.closeQuietly(os);
        }
    }

    public static void downloadExcel(
            HttpServletResponse response,
            HttpServletRequest request,
            String title, XSSFWorkbook workbook
    ) throws IOException {
        response.reset();
        response.setContentType("application/force-download");// 设置强制下载不打开            
        String exportTitle =  title + ".xlsx";
        OutputStream os = null;
        try {
            String agent = request.getHeader(HttpHeaders.USER_AGENT);
            String enableFileName = parseAgentDownloadFIleName(exportTitle, agent);
            response.addHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment;fileName=" + enableFileName);
            os = response.getOutputStream();
            workbook.write(os);
            os.flush();
        } catch (UnsupportedEncodingException e) {
            LOGGER.error("file name encoding has error!" + e);
        } finally {
            IOUtils.closeQuietly(os);
        }
    }

    /**
     * 通过userAgent 解析 下载文件
     *
     * @param exportTitle 下载文件名
     * @param agent       request userAgent
     * @return 解析后的文件名称
     */
    private static String parseAgentDownloadFIleName(String exportTitle, String agent) {
        String enableFileName;
        try {
            if (agent != null && StringUtils.containsIgnoreCase(agent, FIREFOX_AGENT)) {
                //火狐浏览器下载附件乱码
                enableFileName = "=?UTF-8?B?" +
                        (new String(Base64.encodeBase64(exportTitle.getBytes("UTF-8")))) + "?=";

            } else if (agent != null && StringUtils.containsIgnoreCase(agent, SAFARI_AGENT)) {
                //safari浏览器下载附件
                enableFileName = new String(exportTitle.getBytes("UTF-8"), "ISO-8859-1");
            } else {
                //其他浏览器下载附件
                enableFileName = URLEncoder.encode(exportTitle, "utf-8");
            }
        } catch (UnsupportedEncodingException e) {
            LOGGER.error("生成下载文件名称处理解析失败，文件名称为 {} ", exportTitle, e);

            enableFileName = exportTitle;
        }
        return enableFileName;
    }
}

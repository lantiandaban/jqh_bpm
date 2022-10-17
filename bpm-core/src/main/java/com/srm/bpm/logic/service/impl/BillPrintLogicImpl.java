

package com.srm.bpm.logic.service.impl;

import com.google.common.base.Strings;
import com.google.common.collect.Maps;

import com.srm.bpm.infra.entity.FormSettingEntity;
import com.srm.bpm.infra.entity.ToaBillEntity;
import com.srm.bpm.infra.entity.ToaFormEntity;
import com.srm.bpm.infra.service.FormSettingService;
import com.srm.bpm.infra.service.FormTableService;
import com.srm.bpm.infra.service.ToaBillService;
import com.srm.bpm.infra.service.ToaFormService;
import com.srm.bpm.logic.service.BillPrintLogic;
import com.srm.config.BpmConfig;
import com.srm.bpm.logic.constant.FormConst;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.afterturn.easypoi.excel.ExcelExportUtil;
import cn.afterturn.easypoi.excel.ExcelXorHtmlUtil;
import cn.afterturn.easypoi.excel.entity.ExcelToHtmlParams;
import cn.afterturn.easypoi.excel.entity.TemplateExportParams;
import cn.hutool.core.collection.CollectionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BillPrintLogicImpl implements BillPrintLogic {
    private final ToaBillService billService;
    private final ToaFormService formService;
    private final FormSettingService formSettingService;
    private final FormTableService formTableService;
    private final BpmConfig bpmConfig;
    private static final String FIREFOX_AGENT = "firefox";
    private static final String IE_AGENT = "msie";
    private static final String SAFARI_AGENT = "safari";

    @Override
    public void download(Long billId, HttpServletResponse resp, HttpServletRequest request) {

        final ToaBillEntity byId = billService.getById(billId);
        String title = byId.getTitle();
        final XSSFWorkbook workbook = getExcel(billId, title);
        if (Objects.isNull(workbook)) {
            return;
        }
        try {
            downloadNewExcel(resp, request, title, workbook);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private XSSFWorkbook getExcel(Long billId, String title) {
        final ToaFormEntity byBillId = formService.findByBillId(billId);
        if (!Objects.isNull(byBillId)) {
            final Long id = byBillId.getId();
            final Optional<FormSettingEntity> byFormId = formSettingService.findByFormId(id);
            if (byFormId.isPresent()) {
                final FormSettingEntity formSettingEntity = byFormId.get();
                final String printTemplatePath = formSettingEntity.getPrintTemplatePath();
                if (!Strings.isNullOrEmpty(printTemplatePath)) {
                    final String tableName = byBillId.getTableName();
                    String mainSql = "select * from TABLE where id_=#{id}";
                    Map<String, Object> params = Maps.newHashMap();
                    params.put("id", billId);
                    final int byTableSize = formTableService.findByTableSize(tableName + FormConst.DETAIL_TABLENAME);
                    final List<Map<String, Object>> mainData = formTableService.executeSelectSql(mainSql.replace("TABLE", tableName), params);
                    log.info("{}", mainData);
                    TemplateExportParams exportParams = new TemplateExportParams(
                            bpmConfig.getFilePath() + File.separator + printTemplatePath);
                    Map<String, Object> map = Maps.newHashMap();
                    map.put("title", title);
                    if (CollectionUtil.isNotEmpty(mainData)) {
                        map.put("main", mainData.get(0));
                    }
                    for (int i = 1; i <= byTableSize; i++) {
                        String detailSql = "select * from TABLE where main_id_=#{sql.id}";
                        final List<Map<String, Object>> list = formTableService.executeSelectSql(detailSql.replace("TABLE", tableName + FormConst.DETAIL_TABLENAME + i), params);
                        log.info("{}", list);
                        map.put("detail" + i, list);
                    }
                    XSSFWorkbook workbook = (XSSFWorkbook) ExcelExportUtil.exportExcel(exportParams, map);
                    return workbook;

                }
            }
        }
        return null;
    }

    @Override
    public String print(Long billId) {
        final ToaBillEntity byId = billService.getById(billId);
        String title = byId.getTitle();
        final XSSFWorkbook workbook = getExcel(billId, title);
        String html = ExcelXorHtmlUtil.excelToHtml(new ExcelToHtmlParams(workbook, true,0, "yes"));
        return html;
    }

    public static void downloadNewExcel(
            HttpServletResponse response,
            HttpServletRequest request,
            String title, XSSFWorkbook workbook
    ) throws IOException {
        response.reset();
        response.setContentType("application/vnd.ms-excel;charset=utf-8");
        String exportTitle = title + ".xlsx";
        OutputStream os = null;
        try {
            String agent = request.getHeader(HttpHeaders.USER_AGENT);
            String enableFileName = parseAgentDownloadFIleName(exportTitle, agent);
            response.addHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment;fileName=" + enableFileName);
            os = response.getOutputStream();
            workbook.write(os);
            os.flush();
        } catch (UnsupportedEncodingException e) {
            log.error("file name encoding has error!" + e);
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
            log.error("生成下载文件名称处理解析失败，文件名称为 {} ", exportTitle, e);
            enableFileName = exportTitle;
        }
        return enableFileName;
    }
}

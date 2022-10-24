

package com.srm.bpm.facade.rest;

import com.srm.bpm.facde.dto.BaseProcessDTO;
import com.srm.bpm.facde.dto.ProcessGridDTO;
import com.srm.bpm.logic.service.FormSettingLogic;
import com.srm.bpm.logic.service.LoginUserHolder;
import com.srm.bpm.logic.service.ProcessDesingerLogic;
import com.srm.bpm.logic.service.ProcessFlowLogic;
import com.srm.config.BpmConfig;
import com.srm.common.data.rest.R;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.lang.Pair;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import springfox.documentation.annotations.ApiIgnore;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/flow/process/rest")
@Api(tags = "流程管理")
@Slf4j
public class ProcessFlowRestController {
    private final DataSourceProperties dataSourceProperties;
    private final ProcessFlowLogic processFlowLogic;
    private final ProcessDesingerLogic processDesingerLogic;
    private final LoginUserHolder loginUserHolder;
    private final FormSettingLogic formSettingLogic;
    private final BpmConfig bpmConfig;

    @ApiOperation(value = "分页查询流程", httpMethod = "GET")
    @ApiImplicitParams({@ApiImplicitParam(name = "page", defaultValue = "1"), @ApiImplicitParam(name = "limit", defaultValue = "10")})
    @GetMapping("/list")
    public R<List<ProcessGridDTO>> grid(
            @ApiIgnore @RequestParam Map<String, Object> params
    ) {
        final Integer pageNo = Integer.valueOf((String) params.get("page"));
        final Integer pageSize = Integer.valueOf((String) params.get("limit"));
        final String bloc = loginUserHolder.getBloc();
        Pair<List<ProcessGridDTO>, Long> pair =
                processFlowLogic.getProcessFlowByPage(pageNo, pageSize, params, bloc);
        return R.ok(pair.getKey(), pair.getValue());
    }

    @ApiOperation(value = "保存流程基本信息", httpMethod = "POST")
    @PostMapping("save")
    public R save(@RequestBody BaseProcessDTO process) {
        final String bloc = loginUserHolder.getBloc();
        return R.state(this.processFlowLogic.saveProcess(process, bloc));
    }

    /**
     * 删除流程
     *
     * @param processId 流程
     * @return 删除结果
     */
    @ApiOperation(value = "删除流程", httpMethod = "DELETE")
    @ApiImplicitParam(name = "id", value = "流程id", required = true, paramType = "path", dataType = "Long")
    @DeleteMapping("/{id}")
    public R remove(@ApiIgnore @PathVariable(value = "id", required = false) long processId) {
        return R.state(processFlowLogic.removeProcess(processId));
    }

    /**
     * 撤回流程
     *
     * @param processId 流程
     * @return 撤回结果
     */
    @ApiOperation(value = "撤回流程", httpMethod = "PUT")
    @ApiImplicitParam(name = "id", value = "流程id", required = true, paramType = "path", dataType = "Long")
    @PutMapping("/cancel/{id}")
    public R cancel(@ApiIgnore @PathVariable(value = "id", required = false) long processId) {
        return R.state(processFlowLogic.cancelProcess(processId));
    }

    /**
     * 启用流程
     *
     * @param processId 流程
     * @return 启动结果
     */
    @ApiOperation(value = "启用流程", httpMethod = "PUT")
    @ApiImplicitParam(name = "id", value = "流程id", required = true, paramType = "path", dataType = "Long")
    @PutMapping("/enable/{id}")
    public R enable(@ApiIgnore @PathVariable(value = "id", required = false) long processId) {
        System.out.printf("a:" + dataSourceProperties.getUrl());
        return R.state(processFlowLogic.enableProcess(processId));
    }

    /**
     * 禁用流程
     *
     * @param processId 流程
     * @return 禁用结果
     */
    @ApiOperation(value = "禁用流程", httpMethod = "PUT")
    @ApiImplicitParam(name = "id", value = "流程id", required = true, paramType = "path", dataType = "Long")
    @PutMapping("/disable/{id}")
    public R disable(@ApiIgnore @PathVariable(value = "id", required = false) long processId) {
        return R.state(processFlowLogic.disableProcess(processId));
    }

    /**
     * 发布流程
     *
     * @param processId 流程ID
     * @return 发布是否成功
     */
    @ApiOperation(value = "发布流程", httpMethod = "PUT")
    @ApiImplicitParam(name = "id", value = "流程id", required = true, paramType = "path", dataType = "Long")
    @PutMapping("release/{id}")
    public R release(
            @PathVariable(value = "id") long processId
    ) {
        return R.state(this.processFlowLogic.releaseProcess(processId));
    }

    /**
     * 保存流程
     *
     * @param processDesingerData 流程设计信息
     * @return 流程处理结果
     */
    @PostMapping("process/save")
    public R save(
            @RequestParam("data") String processDesingerData, @RequestParam("id") long processId
    ) {
        log.info("提交的流程数据:\n{}", processDesingerData);
        this.processDesingerLogic.saveProcessAndSetting(processDesingerData, processId);
        return R.empty();
    }

    /**
     * 开始使用流程
     *
     * @param processId 流程主键
     * @return 操作响应
     */
    @PostMapping("/open")
    public R open(
            @RequestParam("id") long processId
    ) {

        final boolean openState = this.processFlowLogic.openProcess(processId);
        return R.state(openState);
    }

    /**
     * 关闭流程
     *
     * @param processId 流程主键
     * @return 操作响应
     */
    @PostMapping("/closed")
    public R closed(@RequestParam("id") long processId) {
        final boolean openState = this.processFlowLogic.closeProcess(processId);
        return R.state(openState);
    }

    @PostMapping("/temp/save/{id}")
    public R savePrintTemp(
            @PathVariable(value = "id") long processId, @RequestParam("file") MultipartFile var1
    ) {
        final boolean b = this.formSettingLogic.updatePrintTemp(processId, var1);
        return R.state(b);
    }

    @GetMapping("/temp/down")
    public void tempDown(String path, HttpServletResponse resp) {
        final String filePath = bpmConfig.getFilePath();
        try {
            InputStream inputStream = new FileInputStream(filePath + File.separator + path);
            String fileName = FileUtil.getName(path);
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

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @PostMapping("/formlink/save")
    public R formLinkSave(
            @RequestParam(value = "formLink", required = false, defaultValue = "") String formLink,
            @RequestParam(value = "approveLink", required = false, defaultValue = "") String approveLink,
            @RequestParam(value = "manualStartFlag", required = false, defaultValue = "1") Integer manualStartFlag,
            @RequestParam("id") long processId
    ) {
        final boolean b = this.formSettingLogic.updateFormLink(processId, formLink, approveLink,
                manualStartFlag);
        return R.state(b);
    }
}

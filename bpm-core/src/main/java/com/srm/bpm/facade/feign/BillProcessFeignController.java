

package com.srm.bpm.facade.feign;

import com.google.common.base.Strings;
import com.google.common.collect.Lists;

import com.srm.bpm.facde.dto.BaseProcessDTO;
import com.srm.bpm.facde.dto.ProcessDTO;
import com.srm.bpm.facde.dto.ProcessGridDTO;
import com.srm.bpm.facde.dto.ProcessTypeDTO;
import com.srm.bpm.logic.converts.ProcessBasicConvert;
import com.srm.bpm.logic.service.LoginUserHolder;
import com.srm.bpm.logic.service.ProcessFlowLogic;
import com.srm.bpm.logic.service.ProcessTypeLogic;
import com.srm.bpm.logic.vo.ProcessTypeVO;
import com.srm.bpm.logic.vo.ProcessVO;
import com.srm.common.data.rest.R;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Set;

import cn.hutool.core.lang.Pair;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import springfox.documentation.annotations.ApiIgnore;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@RequestMapping("/bill/process/feign")
@RestController
@RequiredArgsConstructor
@Api(tags = "流程列表")
public class BillProcessFeignController {
    private final ProcessTypeLogic processTypeLogic;
    private final LoginUserHolder loginUserHolder;
    private final ProcessFlowLogic processFlowLogic;
    private final ProcessBasicConvert processBasicConvert;

    /**
     * 获取系统已经开启的业务流程列表接口，连同业务流程类型一起将数据放回
     *
     * @return 业务流程列表
     */
    @ApiOperation(value = "查询可以发起的流程列表", httpMethod = "GET")
    @GetMapping("list/type")
    public R<List<ProcessTypeDTO>> listType(String name) {
        final String userCode = loginUserHolder.getUserCode();
        final Set<String> userOrgs = loginUserHolder.getUserOrgs();
        final String bloc = loginUserHolder.getBloc();
        final List<ProcessTypeVO> processTypes = this.processTypeLogic.selectAllWithTypeGroup(userCode, userOrgs, bloc, Strings.isNullOrEmpty(name) ? "" : name);
        List<ProcessTypeDTO> result = Lists.newArrayList();
        for (ProcessTypeVO processType : processTypes) {
            final List<ProcessVO> flows = processType.getFlows();
            List<ProcessDTO> a = processBasicConvert.processVOtoDTO(flows);
            final ProcessTypeDTO processTypeDTO = processBasicConvert.processTypeVOToDTO(processType);
            processTypeDTO.setFlows(a);
            result.add(processTypeDTO);
        }
        return R.ok(result);
    }

    /**
     * 获取系统的流程分类
     *
     * @return 流程分类
     */
    @ApiOperation(value = "查询流程分类列表", httpMethod = "GET")
    @GetMapping("/type")
    public R<List<ProcessTypeDTO>> allType() {
        List<ProcessTypeDTO> result = processTypeLogic.getAllType();
        return R.ok(result);
    }

    @ApiOperation(value = "分页查询流程", httpMethod = "GET")
    @ApiImplicitParams(
            {
                    @ApiImplicitParam(name = "page", defaultValue = "1"),
                    @ApiImplicitParam(name = "limit", defaultValue = "10")
            })
    @GetMapping("/list")
    public R<List<ProcessGridDTO>> grid(
            @ApiIgnore @RequestParam Map<String, Object> params
    ) {
        final Integer pageNo = Integer.valueOf((String) params.get("page"));
        final Integer pageSize = Integer.valueOf((String) params.get("limit"));
        final String bloc = loginUserHolder.getBloc();
        Pair<List<ProcessGridDTO>, Long> pair = processFlowLogic.getProcessFlowByPage(pageNo, pageSize, params, bloc);
        return R.ok(pair.getKey(), pair.getValue());
    }

    @ApiOperation(value = "获取流程基础信息", httpMethod = "GET")
    @GetMapping("info")
    public R<BaseProcessDTO> detail(
            Long id
    ) {
        BaseProcessDTO result = processFlowLogic.getBaseInfo(id);
        return R.ok(result);
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
     * 开始使用流程
     *
     * @param processId 流程主键
     * @return 操作响应
     */
    @PutMapping("/open/{id}")
    public R open(
            @PathVariable(value = "id") long processId
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
    @PutMapping("/closed/{id}")
    public R closed(@PathVariable(value = "id") long processId) {
        final boolean openState = this.processFlowLogic.closeProcess(processId);
        return R.state(openState);
    }

    @GetMapping("/print/tmp")
    public R printTmp(Long id) {
        return R.ok(this.processFlowLogic.getPrintTmp(id));
    }
}

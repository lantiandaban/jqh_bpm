 

package com.srm.bpm.facade.rest;

import com.srm.bpm.logic.dto.ProcessTypeDTO;
import com.srm.bpm.logic.service.ProcessTypeLogic;
import com.srm.common.data.rest.R;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

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
@RestController
@RequiredArgsConstructor
@RequestMapping("/process/type")
@Api(tags = "流程分类")
public class ProcessTypeRestController {

    private final ProcessTypeLogic processTypeLogic;

    @ApiOperation(value = "分页查询流程分类", httpMethod = "GET")
    @ApiImplicitParams(
            {
                    @ApiImplicitParam(name = "page", defaultValue = "1"),
                    @ApiImplicitParam(name = "limit", defaultValue = "10")
            })
    @GetMapping("/list")
    public R<List<ProcessTypeDTO>> grid(
            @ApiIgnore @RequestParam Map<String, Object> params
    ) {
        final Integer pageNo = Integer.valueOf((String) params.get("page"));
        final Integer pageSize = Integer.valueOf((String) params.get("limit"));
        Pair<List<ProcessTypeDTO>, Long> pair = processTypeLogic.getProcessTypeByPage(pageNo, pageSize);
        return R.ok(pair.getKey(), pair.getValue());
    }

    @ApiOperation(value = "获取流程分类详情", httpMethod = "GET")
    @ApiImplicitParam(name = "id", value = "id", required = true, paramType = "path", dataType = "String")
    @GetMapping("/{id}")
    public R<ProcessTypeDTO> detail(@ApiIgnore @PathVariable Long id) {
        ProcessTypeDTO processTypeDTO = processTypeLogic.getDetail(id);
        return R.ok(processTypeDTO);
    }

    @ApiOperation(value = "删除流程分类", httpMethod = "DELETE")
    @ApiImplicitParam(name = "ids", value = "多个id逗号隔开", required = true, paramType = "path", dataType = "String")
    @DeleteMapping("/{ids}")
    public R delete(@ApiIgnore @PathVariable String ids) {
        final List<String> idList = Arrays.asList(ids.split(","));
        return R.state(processTypeLogic.batchDeleteByIds(idList));
    }

    @ApiOperation(value = "保存流程分类", httpMethod = "POST")
    @PostMapping()
    public R save(
            @Valid @RequestBody ProcessTypeDTO processType
    ) {
        return R.state(processTypeLogic.save(processType));
    }
}

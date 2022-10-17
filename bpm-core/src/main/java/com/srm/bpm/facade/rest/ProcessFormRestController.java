

package com.srm.bpm.facade.rest;

import com.srm.bpm.logic.service.ProcessFormLogic;
import com.srm.common.data.rest.R;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/process/form/rest")
@Api(tags = "流程表单设计")
public class ProcessFormRestController {
    private final ProcessFormLogic processFormLogic;

    /**
     * 保存表单元素
     * <p>
     * 1. 解析出表单的字段信息
     * <p>
     * 2. 解析出表单所使用的表达式信息
     * <p>
     * 3. 存储表单信息
     *
     * @param data 表单信息
     * @return 表单信息
     */
    @ApiOperation("保存表单元素")
    @PostMapping("save")
    public R save(
            @RequestParam("data") String data
    ) {
        return R.state(processFormLogic.saveForm(data));
    }

}

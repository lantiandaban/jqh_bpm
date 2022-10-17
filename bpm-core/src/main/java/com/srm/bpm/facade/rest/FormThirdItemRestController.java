

package com.srm.bpm.facade.rest;

import com.srm.bpm.infra.service.FormThirdItemLogic;
import com.srm.bpm.logic.dto.FormThirdDTO;
import com.srm.bpm.logic.dto.FormThirdItemDTO;
import com.srm.common.data.rest.R;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
@RequestMapping("/form/third/item/rest")
@RequiredArgsConstructor
@Api(tags = "表单第三方配置")
public class FormThirdItemRestController {
    private final FormThirdItemLogic formThirdItemLogic;

    @GetMapping("/list")
    @ApiOperation(value = "查询表单字段列表", httpMethod = "GET")
    public R<List<FormThirdItemDTO>> list(Long processId) {
        List<FormThirdItemDTO> list = formThirdItemLogic.findByProcessId(processId);
        return R.ok(list);
    }

    @PostMapping("/save")
    @ApiOperation(value = "保存配置", httpMethod = "GET")
    public R save(@RequestBody FormThirdDTO formThirdDTO) {
        formThirdItemLogic.save(formThirdDTO);
        return R.ok();
    }
}

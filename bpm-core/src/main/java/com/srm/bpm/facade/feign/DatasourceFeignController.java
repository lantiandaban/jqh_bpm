

package com.srm.bpm.facade.feign;

import com.srm.bpm.facde.dto.DatasourceDTO;
import com.srm.bpm.logic.service.DataSourceLogic;
import com.srm.common.data.rest.R;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import cn.hutool.core.lang.Pair;
import io.swagger.annotations.Api;
import lombok.RequiredArgsConstructor;
import springfox.documentation.annotations.ApiIgnore;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */

@RequestMapping("/process/datasource/feign")
@RestController
@RequiredArgsConstructor
@Api(tags = "数据源列表")
public class DatasourceFeignController {
    private final DataSourceLogic dataSourceLogic;
    @GetMapping("/list")
    public R<List<DatasourceDTO>> grid(
            @ApiIgnore @RequestParam Map<String, Object> params
    ) {
        final Integer pageNo = Integer.valueOf((String) params.get("page"));
        final Integer pageSize = Integer.valueOf((String) params.get("limit"));
        Pair<List<DatasourceDTO>, Long> pair = dataSourceLogic.getDatasourceByPage(pageNo, pageSize);
        return R.ok(pair.getKey(), pair.getValue());
    }
}

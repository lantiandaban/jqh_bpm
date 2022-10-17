

package com.srm.bpm.facde;

import com.srm.bpm.facde.dto.DatasourceDTO;
import com.srm.common.data.rest.R;

import java.util.List;
import java.util.Map;

import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Slf4j
public class DatesourceHttpClient extends BaseHttpClient {
    private final RestTemplateUtil restTemplateUtil;

    public DatesourceHttpClient(RestTemplateUtil restTemplate, String host) {
        this.restTemplateUtil = restTemplate;
        if (host.endsWith(StrUtil.C_SLASH + "")) {
            host = host.substring(0, host.length() - 1);
        }
        this.host = host;
    }

    public R<List<DatasourceDTO>> list(Map<String, Object> params, String user) {
        final String url = this.host + datasourceUrl + "/list";
        final R<List<DatasourceDTO>> r = restTemplateUtil.getList(url, params, user, DatasourceDTO.class);
        return r;
    }
}

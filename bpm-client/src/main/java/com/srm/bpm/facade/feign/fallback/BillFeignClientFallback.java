

package com.srm.bpm.facade.feign.fallback;

import com.srm.bpm.facade.feign.BillFeignClient;
import com.srm.bpm.facde.dto.BillItemDTO;
import com.srm.common.data.rest.R;

import org.springframework.stereotype.Component;

import java.util.Map;

import lombok.extern.slf4j.Slf4j;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Component
@Slf4j
public class BillFeignClientFallback implements BillFeignClient {
    @Override
    public R<BillItemDTO> approved(Map<String, Object> params) {
        return null;
    }

    @Override
    public R<BillItemDTO> todo(Map<String, Object> params) {
        return null;
    }

    @Override
    public R<BillItemDTO> minecreate(Map<String, Object> params) {
        return null;
    }

    @Override
    public R<BillItemDTO> drafts(Map<String, Object> params) {
        return null;
    }

    @Override
    public R<BillItemDTO> cc(Map<String, Object> params) {
        return null;
    }
}

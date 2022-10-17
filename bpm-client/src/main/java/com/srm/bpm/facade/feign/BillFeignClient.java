

package com.srm.bpm.facade.feign;

import com.srm.bpm.facade.feign.fallback.BillFeignClientFallback;
import com.srm.bpm.facde.dto.BillItemDTO;
import com.srm.common.data.rest.R;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@FeignClient(name = "bpm-server", fallback = BillFeignClientFallback.class)
public interface BillFeignClient {
    String BaseURL="/bill/list/feign";

    @GetMapping(BaseURL+"/approved")
    R<BillItemDTO> approved(@RequestParam Map<String, Object> params);

    @GetMapping(BaseURL+"/todo")
    R<BillItemDTO> todo(@RequestParam Map<String, Object> params);

    @GetMapping(BaseURL+"/minecreate")
    R<BillItemDTO> minecreate(@RequestParam Map<String, Object> params);

    @GetMapping(BaseURL+"/drafts")
    R<BillItemDTO> drafts(@RequestParam Map<String, Object> params);

    @GetMapping(BaseURL+"/cc")
    R<BillItemDTO> cc(@RequestParam Map<String, Object> params);
}

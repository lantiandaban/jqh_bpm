

package com.srm.bpmserver.logic.impl;

import com.alibaba.fastjson.JSONObject;
import com.srm.bpm.facde.RestTemplateUtil;
import com.srm.bpm.logic.service.CallBackLogic;
import com.srm.config.BpmConfig;
import com.srm.common.data.rest.R;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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
public class CallBackLogicImpl implements CallBackLogic {
    private final RestTemplateUtil restTemplateUtil;
    private final BpmConfig bpmConfig;

    /**
     * 回调
     *
     * @param processId 流程id
     * @param billId    审批单id
     * @param status    状态
     */
    @Override
    public void callBack(Long processId, Long billId, Integer status) {
        log.info("触发了回调:{},{},{}", processId, billId, status);
        JSONObject data = new JSONObject();
        data.put("processId", processId);
        data.put("billId", billId);
        data.put("status", status);
        log.info("回调返回的数据:{}", data);

        final ResponseEntity<R> post = restTemplateUtil.post(bpmConfig.getCallbackUrl(), data, "1");
        log.info("回调返回的数据:{}", post);
    }
}

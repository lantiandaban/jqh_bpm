/*
 * The Hefei JingTong RDC(Research and Development Centre) Group.
 * __________________
 *
 *    Copyright 2015-2021
 *    All Rights Reserved.
 *
 *    NOTICE:  All information contained herein is, and remains
 *    the property of JingTong Company and its suppliers,
 *    if any.
 */

package com.srm.bpm.logic.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.srm.bpm.facde.RestTemplateUtil;
import com.srm.bpm.logic.dto.FlowMsgDTO;
import com.srm.bpm.logic.service.PushMsgLogic;
import com.srm.common.data.rest.R;
import com.srm.config.BpmConfig;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PushMsgLogicImpl implements PushMsgLogic {
    private final RestTemplateUtil restTemplateUtil;
    private final BpmConfig bpmConfig;

	@Override
	public void push(List<FlowMsgDTO> allMsg) {
		allMsg = allMsg.stream().filter(e->(e.getPush() != null && !e.getPush().equals(""))).collect(Collectors.toList());
		if(!CollectionUtils.isEmpty(allMsg)) {
			JSONObject data = new JSONObject();
			data.put("msg", JSON.toJSON(allMsg));
			log.info("消息推送的数据:{}", allMsg);
			final ResponseEntity<R> post = restTemplateUtil.post(bpmConfig.getPushmsgUrl(), data, "1");
			log.info("消息返回的数据:{}", post);
		}
	}
}


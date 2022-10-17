

package com.srm.bpm.facade.rest;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.srm.bpm.logic.define.FormXtype;
import com.srm.bpm.logic.service.LinkqueryLogic;
import com.srm.bpm.logic.service.LoginUserHolder;
import com.srm.config.SpringContextHolder;

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

/**
 * <p> </p>
 *
 * @author Administrator
 * @version 1.0
 * @since JDK 1.7
 */
@RestController
@RequestMapping("/api/form")
@RequiredArgsConstructor
public class LinkqueryController {
    private final LoginUserHolder loginUserHolder;

    @PostMapping("/linkquery")
    public ResponseEntity index(
            @RequestParam("query") String json,
            @RequestParam("processId") long processId) {
        JSONObject linkqueryParamDto = JSON.parseObject(json);
        String xtype = linkqueryParamDto.getString("xtype");
        String block = linkqueryParamDto.getString("block");
        if (StringUtils.equals(xtype, FormXtype.detailgroup
                .name())) {
            LinkqueryLogic<JSONArray> iLinkqueryService = SpringContextHolder.getBean(block);
            JSONArray jsonArray = iLinkqueryService.excute(json, loginUserHolder.getUserCode(), processId);
            return ResponseEntity.ok(jsonArray);
        } else if (StringUtils.equals(xtype, FormXtype.text.name())
                || StringUtils.equals(xtype, FormXtype.money.name())
                || StringUtils.equals(xtype, FormXtype.number.name())
                ) {
            LinkqueryLogic<JSONObject> iLinkqueryService = SpringContextHolder.getBean(block);
            JSONObject result = iLinkqueryService.excute(json, loginUserHolder.getUserCode(), processId);
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}

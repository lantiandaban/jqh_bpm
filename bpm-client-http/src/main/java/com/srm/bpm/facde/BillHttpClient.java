

package com.srm.bpm.facde;

import com.google.common.collect.Maps;

import com.alibaba.fastjson.JSONObject;
import com.srm.bpm.facde.dto.BillItemDTO;
import com.srm.bpm.facde.dto.BillTaskDTO;
import com.srm.bpm.facde.dto.ProcessTypeDTO;
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
public class BillHttpClient extends BaseHttpClient {
    private final RestTemplateUtil restTemplateUtil;

    public BillHttpClient(RestTemplateUtil restTemplateUtil, String host) {
        this.restTemplateUtil = restTemplateUtil;
        if (host.endsWith(StrUtil.C_SLASH + "")) {
            host = host.substring(0, host.length() - 1);
        }
        this.host = host;
    }

    public R<List<BillItemDTO>> minecreate(Map<String, Object> params, String user) {
        final R<List<BillItemDTO>> objectR = restTemplateUtil.getList(this.host + ListUrl + "/minecreate", params, user,BillItemDTO.class);
        return objectR;
    }

    public R<List<BillItemDTO>> approved(Map<String, Object> params, String user) {
        final R<List<BillItemDTO>> objectR = restTemplateUtil.getList(this.host + ListUrl + "/approved", params, user,BillItemDTO.class);
        return objectR;
    }

    public R<List<BillItemDTO>> todo(Map<String, Object> params, String user) {
        final R<List<BillItemDTO>> objectR = restTemplateUtil.getList(this.host + ListUrl + "/todo", params, user,BillItemDTO.class);
        return objectR;
    }

    public R<List<ProcessTypeDTO>> todoCateSize(String user) {
        Map<String, Object> params = Maps.newHashMap();
        R<List<ProcessTypeDTO>> a = restTemplateUtil.getList(this.host + ListUrl + "/todo/cate/size", params, user,ProcessTypeDTO.class);
        return a;
    }

    public R<String> todoSize(String user) {
        Map<String, Object> params = Maps.newHashMap();
        final R<String> objectR = restTemplateUtil.getOne(this.host + ListUrl + "/todo/size", params, user,String.class);
        return objectR;
    }

    public R<List<BillItemDTO>> drafts(Map<String, Object> params, String user) {
        final R<List<BillItemDTO>> objectR = restTemplateUtil.getList(this.host + ListUrl + "/drafts", params, user,BillItemDTO.class);
        return objectR;
    }

    public R<List<BillItemDTO>> cc(Map<String, Object> params, String user) {
        final R<List<BillItemDTO>> objectR = restTemplateUtil.getList(this.host + ListUrl + "/cc", params, user,BillItemDTO.class);
        return objectR;
    }

    public R<List<BillItemDTO>> findAll(Map<String, Object> params, String user) {
        final R<List<BillItemDTO>> objectR = restTemplateUtil.getList(this.host + ListUrl + "/all/bill", params, user,BillItemDTO.class);
        return objectR;
    }

    public R<BillItemDTO> submit(JSONObject data, String user) {
        return restTemplateUtil.postReturnOne(this.host + thirdPartUrl + "/submit", data, user,BillItemDTO.class);
    }

    public R<BillItemDTO> saveDrafts(JSONObject data, String user) {
        return restTemplateUtil.postReturnOne(this.host + thirdPartUrl + "/save", data, user,BillItemDTO.class);
    }

    public R<List<BillTaskDTO>> getHistoryTasks(String billId, String user) {
        Map<String, Object> params = Maps.newHashMap();
        params.put("billId", billId);
        final R<List<BillTaskDTO>> result = restTemplateUtil.getList(this.host + ListUrl + "/history/tasks", params, user,BillItemDTO.class);
        return result;
    }

}

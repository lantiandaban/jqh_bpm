

package com.srm.bpm.facde;

import com.google.common.collect.Maps;

import com.alibaba.fastjson.JSON;
import com.srm.bpm.facde.dto.BaseProcessDTO;
import com.srm.bpm.facde.dto.ProcessGridDTO;
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
public class ProcessFLowHttpClient extends BaseHttpClient {
    private final RestTemplateUtil restTemplateUtil;

    public ProcessFLowHttpClient(RestTemplateUtil restTemplateUtil, String host) {
        this.restTemplateUtil = restTemplateUtil;
        if (host.endsWith(StrUtil.C_SLASH + "")) {
            host = host.substring(0, host.length() - 1);
        }
        this.host = host;
    }

    public R<List<ProcessTypeDTO>> types(String user) {
        Map<String, Object> params = Maps.newHashMap();
        final R<List<ProcessTypeDTO>> objectR = restTemplateUtil.getList(this.host + processUrl + "/type", params, user, ProcessTypeDTO.class);
        return objectR;
    }

    public R<List<ProcessTypeDTO>> processTypes(String name, String user) {
        Map<String, Object> params = Maps.newHashMap();
        params.put("name", name);
        final R<List<ProcessTypeDTO>> objectR = restTemplateUtil.getList(this.host + processUrl + "/list/type", params, user, ProcessTypeDTO.class);
        return objectR;
    }

    public R<List<ProcessGridDTO>> grid(
            Map<String, Object> params, String user
    ) {
        final R<List<ProcessGridDTO>> listR = restTemplateUtil.getList(this.host + processUrl + "/list", params, user, ProcessGridDTO.class);
        return listR;
    }

    public R save(BaseProcessDTO process, String user) {
        final String s = JSON.toJSONString(process);
        return restTemplateUtil.postNoReturn(this.host + processUrl + "/save", JSON.parseObject(s), user);
    }

    /**
     * 删除流程
     *
     * @param processId 流程
     * @return 删除结果
     */
    public R remove(long processId, String user) {
        final R listR = restTemplateUtil.delete(this.host + processUrl + "/" + processId, user);
        return listR;
    }

    /**
     * 撤回流程
     *
     * @param processId 流程
     * @return 撤回结果
     */
    public R cancel(long processId, String user) {
        final R listR = restTemplateUtil.put(this.host + processUrl + "/cancel/" + processId, user);
        return listR;
    }

    /**
     * 启用流程
     *
     * @param processId 流程
     * @return 启动结果
     */
    public R enable(long processId, String user) {
        final R listR = restTemplateUtil.put(this.host + processUrl + "/enable/" + processId, user);
        return listR;
    }

    /**
     * 禁用流程
     *
     * @param processId 流程
     * @return 禁用结果
     */
    public R disable(long processId, String user) {
        final R listR = restTemplateUtil.put(this.host + processUrl + "/disable/" + processId, user);
        return listR;
    }

    /**
     * 发布流程
     *
     * @param processId 流程ID
     * @return 发布是否成功
     */
    public R release(
            long processId, String user
    ) {
        final R listR = restTemplateUtil.put(this.host + processUrl + "/release/" + processId, user);
        return listR;
    }


    /**
     * 开始使用流程
     *
     * @param processId 流程主键
     * @return 操作响应
     */
    public R open(
            long processId, String user
    ) {
        final R listR = restTemplateUtil.put(this.host + processUrl + "/open/" + processId, user);
        return listR;
    }

    /**
     * 关闭流程
     *
     * @param processId 流程主键
     * @return 操作响应
     */
    public R closed(long processId, String user) {
        final R listR = restTemplateUtil.put(this.host + processUrl + "/closed/" + processId, user);
        return listR;
    }

    public R<BaseProcessDTO> info(long processId, String user) {
        Map<String, Object> params = Maps.newConcurrentMap();
        params.put("id", processId);
        final R<BaseProcessDTO> oneR = restTemplateUtil.getOne(this.host + processUrl + "/info", params, user, BaseProcessDTO.class);
        return oneR;
    }

    public R<String> printTmp(long processId, String user) {
        Map<String, Object> params = Maps.newConcurrentMap();
        params.put("id", processId);
        final R<String> oneR = restTemplateUtil.getOne(this.host + processUrl + "/print/tmp", params, user, String.class);
        return oneR;
    }
}

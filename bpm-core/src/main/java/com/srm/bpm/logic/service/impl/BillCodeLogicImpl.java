

package com.srm.bpm.logic.service.impl;

import com.google.common.base.Strings;
import com.google.common.collect.Maps;

import com.googlecode.aviator.AviatorEvaluator;
import com.srm.bpm.infra.entity.SysCodeFormatEntity;
import com.srm.bpm.infra.service.SysCodeFormatService;
import com.srm.bpm.logic.service.BillCodeLogic;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@RequiredArgsConstructor
@Service
@Slf4j
public class BillCodeLogicImpl implements BillCodeLogic {
    /**
     * 审批类型
     */
    String PROCESS_TYPE = "process_type";
    /**
     * 审批编码
     */
    String PROCESS_CODE = "process_code";
    protected final SysCodeFormatService codeFormatService;
    @Override
    @Transactional(readOnly = true)
    public String execCodeRule(long codeId, long processId, long processTypeId) {
        if (codeId <= 0) {
            return StringUtils.EMPTY;
        }
        final SysCodeFormatEntity codeFormat = codeFormatService.getById(codeId);
        final String format = codeFormat.getFormat();
        if (Strings.isNullOrEmpty(format)) {
            return StringUtils.EMPTY;
        }
        final Map<String, Object> env = Maps.newHashMap();
        if (StringUtils.contains(format, PROCESS_TYPE)) { //编码模板有业务类型
            if (processTypeId <= 0) {
                return StringUtils.EMPTY;
            }
            env.put("id", processTypeId);
        } else if (StringUtils.contains(format, PROCESS_CODE)) { //编码模板有业务类型
            if (processId <= 0) {
                return StringUtils.EMPTY;
            }
            env.put("id", processId);
        }
        return AviatorEvaluator.execute(format, env).toString();
    }
}

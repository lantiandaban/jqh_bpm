

package com.srm.bpm.logic.service.impl;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import com.srm.bpm.logic.define.FormXtype;
import com.srm.bpm.logic.service.BillItemAssembleLogic;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Service
public class BillItemAssembleLogicImpl implements BillItemAssembleLogic {
    /**
     * 组装第一个值
     */
    @Override
    public Object firstValue(String xtype, String value) {
        if (StringUtils.equals(xtype, FormXtype.detailgroup.name())) {
            return Collections.EMPTY_MAP;
        } else if (StringUtils.equals(xtype, FormXtype.text.name())
                || StringUtils.equals(xtype, FormXtype.money.name())
                || StringUtils.equals(xtype, FormXtype.number.name())
        ) {
            return value;
        } else if (StringUtils.equals(xtype, FormXtype.multiselect.name())
                || StringUtils.equals(xtype, FormXtype.triggerselect.name())
        ) {
            List<Map<String, String>> list = Lists.newArrayList();
            Map<String, String> result = Maps.newHashMap();
            result.put("value", value);
            result.put("text", value);
            list.add(result);
            return list;
        } else if (StringUtils.equals(xtype, FormXtype.select.name())) {
            Map<String, String> result = Maps.newHashMap();
            result.put("value", value);
            result.put("text", value);
            return result;
        }
        return value;
    }
}

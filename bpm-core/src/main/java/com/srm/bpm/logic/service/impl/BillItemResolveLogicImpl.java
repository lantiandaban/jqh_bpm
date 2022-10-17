

package com.srm.bpm.logic.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.srm.bpm.logic.define.FormXtype;
import com.srm.bpm.logic.service.BillItemResolveLogic;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import cn.hutool.core.collection.CollectionUtil;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Service
public class BillItemResolveLogicImpl implements BillItemResolveLogic {
    @Override
    public String firstVale(String xtype, String props, String valueStr) {
        String value = "";
        if (StringUtils.equals(xtype, FormXtype.triggerselect.name())) {
            JSONObject jsonObject = JSON.parseObject(props);
            Boolean multiSelect = jsonObject.getBoolean("multiSelect");
            if (null == multiSelect) {
                JSONObject jsonObject1 = jsonObject.getJSONObject("widget");
                multiSelect = jsonObject1.getBoolean("multiSelect");
                if (null == multiSelect || !multiSelect) {
                    JSONObject jsonObject2 = JSON.parseObject(valueStr);
                    value = jsonObject2.getString("value");
                } else {
                    JSONArray jsonArray = JSON.parseArray(valueStr);
                    if (CollectionUtil.isNotEmpty(jsonArray)) {
                        final JSONObject o = (JSONObject) jsonArray.get(0);
                        value = o.getString("value");
                    }
                }
            } else if (multiSelect) {
                JSONArray jsonArray = JSON.parseArray(valueStr);
                if (CollectionUtil.isNotEmpty(jsonArray)) {
                    final JSONObject o = (JSONObject) jsonArray.get(0);
                    value = o.getString("value");
                }
            } else {
                JSONObject jsonObject2 = JSON.parseObject(valueStr);
                value = jsonObject2.getString("value");
            }
        } else if (StringUtils.equals(xtype, FormXtype.select.name())) {
            JSONObject jsonObject2 = JSON.parseObject(valueStr);
            value = jsonObject2.getString("value");
        } else if (StringUtils.equals(xtype, FormXtype.multiselect.name())) {
            JSONArray jsonArray = JSON.parseArray(valueStr);
            if (CollectionUtil.isNotEmpty(jsonArray)) {
                final JSONObject o = (JSONObject) jsonArray.get(0);
                value = o.getString("value");
            }
        } else if (StringUtils.equals(xtype, FormXtype.text.name())
                || StringUtils.equals(xtype, FormXtype.money.name())
                || StringUtils.equals(xtype, FormXtype.textarea.name())
        ) {
            value = valueStr;
        }
        return value;
    }
}

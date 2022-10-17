

package com.srm.bpm.logic.constant;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;

import java.util.Map;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface FastJsonType {
    TypeReference<Map<String, JSONObject>> MAP_JSONOBJECT_TR = new TypeReference<Map<String,
            JSONObject>>() {
    };
    TypeReference<Map<String, Object>> MAP_OBJECT_TR = new TypeReference<Map<String,
            Object>>() {
    };
    TypeReference<Map<String, String>> MAP_STRING_TR = new TypeReference<Map<String,
            String>>() {
    };
    TypeReference<Map<String, JSONArray>> MAP_JSONARRAY_TR = new TypeReference<Map<String,
            JSONArray>>() {
    };

}

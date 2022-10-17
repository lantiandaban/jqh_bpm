

package com.srm.common.util.bean;


import org.springframework.beans.BeanUtils;

import java.io.Serializable;
import java.lang.invoke.SerializedLambda;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

/**
 * Java Bean 工具类
 *
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
@Slf4j
public class BeanUtil extends cn.hutool.core.bean.BeanUtil {


    /***
     * 获取类对应的Lambda
     * @param fn 函数
     * @return lambda
     */
    public static SerializedLambda getSerializedLambda(Serializable fn) {
        SerializedLambda lambda = null;
        try {
            Method method = fn.getClass().getDeclaredMethod("writeReplace");
            method.setAccessible(Boolean.TRUE);
            lambda = (SerializedLambda) method.invoke(fn);
        } catch (Exception e) {
            log.error("获取SerializedLambda异常, class=" + fn.getClass().getSimpleName(), e);
        }
        return lambda;
    }

    public static <T> T sourceToTarget(Object source, Class<T> target){
        if(source == null){
            return null;
        }
        T targetObject = null;
        try {
            targetObject = target.newInstance();
            BeanUtils.copyProperties(source, targetObject);
        } catch (Exception e) {
            log.error("convert error ", e);
        }

        return targetObject;
    }

    public static <T> List<T> sourceToTarget(Collection<?> sourceList, Class<T> target){
        if(sourceList == null){
            return null;
        }

        List targetList = new ArrayList<>(sourceList.size());
        try {
            for(Object source : sourceList){
                T targetObject = target.newInstance();
                BeanUtils.copyProperties(source, targetObject);
                targetList.add(targetObject);
            }
        }catch (Exception e){
            log.error("convert error ", e);
        }

        return targetList;
    }

}

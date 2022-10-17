

package com.srm.bpm.logic.aviator;

import com.alibaba.fastjson.JSONArray;
import com.googlecode.aviator.AviatorEvaluator;
import com.googlecode.aviator.runtime.function.AbstractFunction;
import com.googlecode.aviator.runtime.type.AviatorBoolean;
import com.googlecode.aviator.runtime.type.AviatorJavaType;
import com.googlecode.aviator.runtime.type.AviatorObject;
import com.googlecode.aviator.runtime.type.AviatorRuntimeJavaType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.StrUtil;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Component
public class ImplicationFunction extends AbstractFunction {

    public static final String NAME = "implication";

    private static final Logger LOGGER = LoggerFactory.getLogger(ImplicationFunction.class);

    @Override
    public AviatorObject call(Map<String, Object> env, AviatorObject arg1, AviatorObject arg2) {
        Object first = arg1.getValue(env);
        if (first == null) {
            throw new NullPointerException("null seq");
        }

        Object sencond = arg2.getValue(env);
        if (sencond == null) {
            return AviatorBoolean.FALSE;
        }
        Class<?> clazz = first.getClass();
        Class<?> implicationClass = sencond.getClass();
        boolean contains = false;
        if (Collection.class.isAssignableFrom(clazz)) {

            Collection<?> seq = (Collection<?>) first;

            if (Collection.class.isAssignableFrom(implicationClass)) {
                // 第二个参数也集合类
                Collection<?> listSencond = (Collection<?>) sencond;
                contains = CollectionUtil.containsAny(seq, listSencond);
            } else if (implicationClass.isArray()) {
                // 第二个参数是数组
                throw new IllegalArgumentException(arg2.desc(env) + " is not a toa collection");
            } else {
                try {
                    String name = ((AviatorJavaType) arg1).getName();
                    if (name.startsWith("fd_")) {
                        final String value = sencond.toString();
                        final List<String> split = StrUtil.split(value, ',');
                        JSONArray a = (JSONArray) first;
                        split.retainAll(a);
                        if (CollectionUtil.isNotEmpty(split)) {
                            contains = true;
                        } else {
                            contains = false;
                        }
                    } else {
                        for (Object obj : seq) {
                            if (new AviatorRuntimeJavaType(obj).compare(arg2, env) == 0) {
                                contains = true;
                                break;
                            }
                        }
                    }

                } catch (Exception e) {
                    LOGGER.error("implication funcation has error!", e);
                    return AviatorBoolean.FALSE;
                }
            }
        } else {
            throw new IllegalArgumentException(arg1.desc(env) + " is not a toa collection");
        }

        return AviatorBoolean.valueOf(contains);
    }

    @Override
    public String getName() {
        return NAME;
    }


    @PostConstruct
    public void addFunction() {
        AviatorEvaluator.addFunction(new ImplicationFunction());
    }
}

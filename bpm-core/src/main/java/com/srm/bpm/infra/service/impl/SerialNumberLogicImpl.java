

package com.srm.bpm.infra.service.impl;

import com.google.common.base.Strings;

import com.srm.bpm.infra.service.SerialNumberLogic;
import com.srm.bpm.logic.constant.StringPool;
import com.srm.common.util.datetime.DateTimeUtil;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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
public class SerialNumberLogicImpl implements SerialNumberLogic {
    private final RedisTemplate<String, String> redisTemplate;

    @Override
    public String serialNumber(String redisCacheKey, int digits) {
        final BoundValueOperations<String, String> operations = redisTemplate.boundValueOps(redisCacheKey);
        if (Strings.isNullOrEmpty(operations.get())) {
            operations.set(StringPool.ZERO);
        }
        Long increment = redisTemplate.opsForValue().increment(redisCacheKey, 1);
        final String digitsFormat = "%0" + digits + "d";
        final String serialNumber = String.format(digitsFormat, increment);
        if (StringUtils.length(serialNumber) > digits) {
            // 如果超过了指定长度，则重新开始
            operations.set(StringPool.ZERO);
            increment = redisTemplate.opsForValue().increment(redisCacheKey, 1);
            return String.format(digitsFormat, increment);
        }
        return serialNumber;
    }

    @Override
    public String dayPolling(String redisCacheKey, int digits) {
        //直接使用日期加毫秒
        return DateTimeUtil.format(LocalDateTime.now(), "yyyyMMddHHmmssSSS");
//        final String redisKey = redisCacheKey + StringPool.COLON + DateTimeUtil.format(LocalDateTime.now(), "yyyy-MM-dd");
//        final BoundValueOperations<String, String> operations = redisTemplate.boundValueOps(redisKey);
//        if (Strings.isNullOrEmpty(operations.get())) {
//            operations.set(StringPool.ZERO, 1, TimeUnit.DAYS);
//        }
//        Long increment = redisTemplate.opsForValue().increment(redisCacheKey, 1);
//        final String digitsFormat = "%0" + digits + "d";
//        final String serialNumber = String.format(digitsFormat, increment);
//        if (StringUtils.length(serialNumber) > digits) {
//            // 如果超过了指定长度，则重新开始
//            operations.set(StringPool.ZERO);
//            increment = redisTemplate.opsForValue().increment(redisCacheKey, 1);
//            return String.format(digitsFormat, increment);
//        }
//        return serialNumber;
    }
}

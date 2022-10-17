

package com.srm.common.base.infra.service.impl;

import com.google.common.base.MoreObjects;

import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.ClassUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;
import com.srm.common.base.infra.service.RedisService;
import com.srm.common.util.serialize.JsonMapper;

/**
 * Redis 消息服务
 *
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
@Service
@Slf4j
public class RedisServiceImpl implements RedisService {
    private final StringRedisTemplate redisTemplate;
    private final RedisTemplate<String, String> redisMapTemplate;

    public RedisServiceImpl(StringRedisTemplate redisTemplate,
                            RedisTemplate<String, String> redisMapTemplate) {
        this.redisTemplate = redisTemplate;
        this.redisMapTemplate = redisMapTemplate;
    }

    @Override
    public void pub(String channel, Object msg) {
        String dataJson = JsonMapper.toJson(msg);
        redisTemplate.convertAndSend(channel, dataJson);
    }

    @Override
    public boolean set(final String key, Object value) {
        // 默认1天有效
        return set(key, value, 24 * 60L * 60L);
    }

    @Override
    public boolean set(final String key, Object value, Long expireTime) {
        boolean result = false;
        try {
            ValueOperations<String, String> operations = redisTemplate.opsForValue();
            if(value instanceof String) {
                operations.set(key, value.toString());
            }else{
                operations.set(key, JsonMapper.toJson(value));
            }
            redisTemplate.expire(key, expireTime, TimeUnit.SECONDS);
            result = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @Override
    public void remove(final String... keys) {
        for (String key : keys) {
            remove(key);
        }
    }

    @Override
    public void remove(final Collection<String> keys) {
        redisTemplate.delete(keys);
    }


    @Override
    public void removeOfPattern(final String pattern) {
        Set<String> keys = redisTemplate.keys(pattern);
        if (CollectionUtil.isEmpty(keys)) {
            return;
        }
        redisTemplate.delete(keys);
    }

    @Override
    public void remove(final String key) {
        if (exists(key)) {
            redisTemplate.delete(key);
        }
    }

    @Override
    public boolean exists(final String key) {
        return MoreObjects.firstNonNull(redisTemplate.hasKey(key), false);
    }

    @Override
    public <T> Optional<T> get(final String key, Class<T> clz) {
        String value = get(key);
        if (StrUtil.isEmpty(value)) {
            return Optional.empty();
        }
        return JsonMapper.fromJson(value, clz);
    }

    @Override
    public <T> List<T> getOfList(final String key, Class<T> clz) {
        String value = get(key);
        if (StrUtil.isEmpty(value)) {
            return Collections.emptyList();
        }
        return JsonMapper.listOfJson(value, clz);
    }

    @Override
    public String get(final String key) {
        ValueOperations<String, String> operations = redisTemplate.opsForValue();
        return operations.get(key);
    }


    @Override
    public void hmSet(String key, String hashKey, Object value) {
        this.hmSet(key, hashKey, JsonMapper.toJson(value));
    }


    @Override
    public void hmSet(String key, String hashKey, String value) {
        HashOperations<String, String, String> hash = redisTemplate.opsForHash();
        hash.put(key, hashKey, value);
    }


    @Override
    public void hmSet(String key, Map<String, Object> hashMap) {
        HashOperations<String, String, Object> hash = redisTemplate.opsForHash();

        for (String haskKey : hashMap.keySet()) {
            Object hashValue = hashMap.get(haskKey);
            if (!(hashValue instanceof String)) {
                hashMap.put(haskKey, JsonMapper.toJson(hashValue));
            }
        }

        hash.putAll(key, hashMap);
    }

    @Override
    public boolean hmHasKey(String key, String hashKey) {
        HashOperations<String, String, String> hash = redisTemplate.opsForHash();
        return hash.hasKey(key, hashKey);
    }


    @Override
    public Optional<String> hmGet(String key, String hashKey) {
        HashOperations<String, String, String> hash = redisTemplate.opsForHash();
        final String hashValue = hash.get(key, hashKey);
        return Optional.ofNullable(hashValue);
    }


    @Override
    public <T> Optional<T> hmGet(String key, String hashKey, Class<T> clz) {
        final Optional<String> valueOpt = hmGet(key, hashKey);
        return valueOpt.flatMap(s -> JsonMapper.fromJson(s, clz));
    }


    @Override
    public Set<String> hmKeys(String cacheKey) {
        return redisTemplate.<String, String>boundHashOps(cacheKey).keys();
    }


    @Override
    public void hmDel(String key, String hasKey) {
        redisTemplate.boundHashOps(key).delete(hasKey);
    }


    @Override
    public void lPush(String k, Object v) {
        ListOperations<String, String> list = redisTemplate.opsForList();
        list.rightPush(k, JsonMapper.toJson(v));
    }


    @Override
    public <T> List<T> lRange(String key, long start, long end, Class<T> tClz) {
        final ListOperations<String, String> list = redisTemplate.opsForList();

        final List<String> rangeValues = list.range(key, start, end);
        if (CollectionUtil.isEmpty(rangeValues)) {
            return Collections.emptyList();
        }

        return rangeValues.stream()
                .map(s -> JsonMapper.fromJson(s, tClz).orElse(null))
                .collect(Collectors.toList());

    }


    @Override
    public void add(String key, String value) {
        SetOperations<String, String> set = redisTemplate.opsForSet();
        set.add(key, value);
    }


    @Override
    public void add(String key, Object value) {
        if (ClassUtil.isBasicType(value.getClass())) {
            value = String.valueOf(value);
        }
        SetOperations<String, String> set = redisTemplate.opsForSet();
        set.add(key, JsonMapper.toJson(value));
    }

    @Override
    public <T> Set<T> setOfMembers(String key, Class<T> tClz) {

        final Set<String> memberStrs = setOfMembers(key);
        if (CollectionUtil.isEmpty(memberStrs)) {
            return Collections.emptySet();
        }

        return memberStrs.stream()
                .map(s -> JsonMapper.fromJson(s, tClz).orElse(null))
                .collect(Collectors.toSet());
    }


    @Override
    public Set<String> setOfMembers(String key) {
        final SetOperations<String, String> set = redisTemplate.opsForSet();
        return set.members(key);
    }


    @Override
    public void delOfMembers(String key, Object... values) {
        if (ArrayUtil.isEmpty(values)) {
            return;
        }
        final SetOperations<String, String> set = redisTemplate.opsForSet();

        set.remove(key, values);
    }


    @Override
    public void zAdd(String key, Object value, double scoure) {
        ZSetOperations<String, String> zset = redisTemplate.opsForZSet();
        zset.add(key, JsonMapper.toJson(value), scoure);
    }


    @Override
    public <T> Set<T> rangeByScore(String key, double min, double max, Class<T> tClz) {
        final ZSetOperations<String, String> zset = redisTemplate.opsForZSet();

        final Set<String> scoreSetStrs = zset.rangeByScore(key, min, max);
        if (CollectionUtil.isEmpty(scoreSetStrs)) {
            return Collections.emptySet();
        }

        return scoreSetStrs.stream()
                .map(s -> JsonMapper.fromJson(s, tClz).orElse(null))
                .collect(Collectors.toSet());
    }


    @Override
    public <T> Set<T> range(String key, long start, long end, Class<T> tClz) {
        ZSetOperations<String, String> zset = redisTemplate.opsForZSet();
        final Set<String> rangSets = zset.range(key, start, end);
        if (CollectionUtil.isEmpty(rangSets)) {
            return Collections.emptySet();
        }

        return rangSets.stream()
                .map(s -> JsonMapper.fromJson(s, tClz).orElse(null))
                .collect(Collectors.toSet());
    }


    @Override
    public Set<String> keys(String pattern) {
        return redisTemplate.keys(pattern);
    }

    /**
     * 基于redis的发布订阅-生产者
     *
     * @param channel 通道
     * @param data    数据
     */
    @Override
    public <T> void redisRroducer(String channel, T data) {
        redisMapTemplate.convertAndSend(channel, data);
    }

}

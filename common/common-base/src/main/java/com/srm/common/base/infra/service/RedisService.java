

package com.srm.common.base.infra.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

/**
 * Redis访问服务
 *
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
public interface RedisService {


    /**
     * 通道数据
     *
     * @param channel 通道
     * @param msg     消息
     */
    void pub(String channel, Object msg);

    /**
     * 写入redis字符串类型的数据
     *
     * @param key   redis KEY
     * @param value redis Value
     * @return 是否操作成功
     */
    boolean set(String key, Object value);

    /**
     * 写入缓存设置时效时间
     *
     * @param key        redis KEY
     * @param value      redis Value
     * @param expireTime 超时时间, 单位秒
     * @return 是否操作成功
     */
    boolean set(String key, Object value, Long expireTime);

    /**
     * 批量删除对应的value
     *
     * @param keys 删除key
     */
    void remove(String... keys);

    /**
     * 批量删除对应的value
     *
     * @param keys 删除key
     */
    void remove(Collection<String> keys);

    /**
     * 批量删除key
     *
     * @param pattern key 的匹配表达式
     */
    void removeOfPattern(String pattern);

    /**
     * 删除对应的value
     *
     * @param key 要删除的KEY
     */
    void remove(String key);

    /**
     * 判断缓存中是否有对应的value
     *
     * @param key 查询KEY
     * @return true 存在 false 不存在
     */
    boolean exists(String key);

    /**
     * 读取缓存
     *
     * @param key key
     * @return 缓存值
     */
    <T> Optional<T> get(String key, Class<T> clz);

    /**
     * 读取缓存
     *
     * @param key key
     * @return 缓存值
     */
    <T> List<T> getOfList(String key, Class<T> clz);

    /**
     * 读取缓存
     *
     * @param key key
     * @return 缓存值
     */
    String get(String key);

    /**
     * 哈希 添加
     *
     * @param key     redis key
     * @param hashKey hash key
     * @param value   hash value
     */
    void hmSet(String key, String hashKey, Object value);

    /**
     * 哈希 添加
     *
     * @param key     redis key
     * @param hashKey hash key
     * @param value   hash value
     */
    void hmSet(String key, String hashKey, String value);

    /**
     * 哈希 添加
     *
     * @param key     redis key
     * @param hashMap 一批Key value
     */
    void hmSet(String key, Map<String, Object> hashMap);

    /**
     * 判断某个哈希中是否存在某个key
     *
     * @param key     哈希key
     * @param hashKey 数据key
     * @return true 存在 false 不存在
     */
    boolean hmHasKey(String key, String hashKey);

    /**
     * 哈希获取数据
     *
     * @param key     redis key
     * @param hashKey hash key
     * @return hash value
     */
    Optional<String> hmGet(String key, String hashKey);

    /**
     * 哈希获取数据
     *
     * @param key     redis key
     * @param hashKey hash key
     * @param clz     泛型类型
     * @param <T>     类型参数
     * @return hash value
     */
    <T> Optional<T> hmGet(String key, String hashKey, Class<T> clz);

    /**
     * 获取某个哈希所有的key
     *
     * @param cacheKey 哈希key
     * @return 所有的key
     */
    Set<String> hmKeys(String cacheKey);

    /**
     * 删除某个Hash Key
     *
     * @param key    key
     * @param hasKey hash
     */
    void hmDel(String key, String hasKey);

    /**
     * 列表添加
     *
     * @param k redis key
     * @param v redis value
     */
    void lPush(String k, Object v);

    /**
     * 列表获取
     *
     * @param key   redis key
     * @param start start index
     * @param end   end index
     * @param tClz  objc class type
     * @param <T>   type
     * @return list value objc
     */
    <T> List<T> lRange(String key, long start, long end, Class<T> tClz);

    /**
     * 集合添加
     *
     * @param key   redis key
     * @param value redis value
     */
    void add(String key, String value);

    /**
     * 集合添加
     *
     * @param key   redis key
     * @param value redis value
     */
    void add(String key, Object value);

    /**
     * 集合获取
     *
     * @param key  redis key
     * @param tClz list objec type class
     * @param <T>  type
     * @return list value
     */
    <T> Set<T> setOfMembers(String key, Class<T> tClz);

    /**
     * 集合获取
     *
     * @param key redis key
     * @return list value
     */
    Set<String> setOfMembers(String key);

    /**
     * 集合set 中删除数据
     *
     * @param key    redis key
     * @param values 数据
     */
    void delOfMembers(String key, Object... values);

    /**
     * 有序集合添加
     *
     * @param key    redis key
     * @param value  redis value
     * @param scoure the score.
     */
    void zAdd(String key, Object value, double scoure);

    /**
     * 有序集合获取
     *
     * @param key  redis key
     * @param min  min score.
     * @param max  max score.
     * @param tClz object type class.
     * @param <T>  type object.
     * @return value.
     */
    <T> Set<T> rangeByScore(String key, double min, double max, Class<T> tClz);

    /**
     * 有序集合获取
     *
     * @param key   redis key
     * @param start start index
     * @param end   end index
     * @param tClz  object type class.
     * @param <T>   type object.
     * @return value.
     */
    <T> Set<T> range(String key, long start, long end, Class<T> tClz);

    /**
     * 获取符合模式的key
     *
     * @param pattern key模式
     * @return 所有符合模式的KEY
     */
    Set<String> keys(String pattern);


    /**
     * 基于redis的发布订阅-生产者
     *
     * @param channel 通道
     * @param data    数据
     * @param <T>     类型
     */
    <T> void redisRroducer(String channel, T data);
}

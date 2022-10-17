

package com.srm.common.base.infra.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.service.IService;

import java.io.Serializable;
import java.util.Optional;

import com.srm.common.base.infra.entity.BaseEntity;


/**
 * 基础服务Service
 *
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
public interface BaseService<T extends BaseEntity> extends IService<T> {


    /**
     * 根据主键获取实体数据
     *
     * @param id 主键ID
     * @return 实体Optional包装
     */
    Optional<T> unique(Serializable id);


    /**
     * 根据查询条件获取唯一数据
     *
     * @param query 查询条件
     * @return 实体数据
     */
    Optional<T> unique(LambdaQueryWrapper<T> query);


    /**
     * 更新一个实体数据
     *
     * @param entity 实体信息
     * @return 是否更新成功
     */
    boolean upldate(T entity);

    /**
     * 更新一个实体数据
     *
     * @param updateWrapper wrapper
     * @return 是否更新成功
     */
    boolean upldate(LambdaUpdateWrapper<T> updateWrapper);

    /**
     * 新增一个实体数据
     *
     * @param entity 实体信息
     * @return 是否成功写入
     */
    boolean insert(T entity);

    /**
     * 新增或者更新，判断唯一属性
     *
     * @param entity 实体
     * @param unionId 唯一ID
     * @return 是否成功更新或者写入
     */
    boolean saveOrUpdate(T entity, Serializable unionId);

}

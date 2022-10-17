

package com.srm.common.base.infra.service.impl;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.srm.common.base.infra.dao.BaseDao;
import com.srm.common.base.infra.entity.BaseEntity;
import com.srm.common.base.infra.service.BaseService;

import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * 通用接口实现类
 *
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
@Slf4j
public class BaseServiceImpl<M extends BaseDao<T>, T extends BaseEntity> extends ServiceImpl<M, T> implements BaseService<T> {
    @Override
    @Transactional(readOnly = true, rollbackFor = Exception.class)
    public Optional<T> unique(Serializable id) {
        T entity = this.getById(id);
        return Optional.ofNullable(entity);
    }

    @Override
    @Transactional(readOnly = true, rollbackFor = Exception.class)
    public Optional<T> unique(@NotNull LambdaQueryWrapper<T> query) {
        query.last(" limit 1");
        T entity = this.getOne(query);
        return Optional.ofNullable(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean upldate(@NotNull T entity) {
        entity.setUpdateTime(LocalDateTime.now());
        return this.updateById(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean upldate(@NotNull LambdaUpdateWrapper<T> updateWrapper) {
        updateWrapper.set(T::getUpdateTime, LocalDateTime.now());
        return this.update(updateWrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean insert(@NotNull T entity) {
        entity.setCreationTime(LocalDateTime.now());
        return this.save(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean saveOrUpdate(T entity, Serializable unionId) {
        if (ObjectUtil.isEmpty(unionId)) {
            return this.insert(entity);
        }
        return this.upldate(entity);
    }
}

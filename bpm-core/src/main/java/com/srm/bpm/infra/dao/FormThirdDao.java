

package com.srm.bpm.infra.dao;

import com.srm.bpm.infra.entity.FormThirdEntity;
import com.srm.common.base.infra.dao.BaseDao;

import org.apache.ibatis.annotations.Param;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author JT
 * @since 2021-07-15
 */
public interface FormThirdDao extends BaseDao<FormThirdEntity> {

    void physicalDeleteById(@Param("id") Long id);
}

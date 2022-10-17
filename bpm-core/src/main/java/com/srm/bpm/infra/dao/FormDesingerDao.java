

package com.srm.bpm.infra.dao;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;

import org.apache.ibatis.annotations.Param;

import com.srm.common.base.infra.dao.BaseDao;
import com.srm.bpm.infra.entity.FormDesingerEntity;

/**
 * <p>
 * 表单设计信息 Mapper 接口
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface FormDesingerDao extends BaseDao<FormDesingerEntity> {

    @InterceptorIgnore(tenantLine = "true")
    FormDesingerEntity selectByProcessId(@Param("processId") long processId);

}

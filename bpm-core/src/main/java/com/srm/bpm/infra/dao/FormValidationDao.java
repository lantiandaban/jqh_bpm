

package com.srm.bpm.infra.dao;

import com.srm.bpm.infra.entity.FormValidationEntity;
import com.srm.common.base.infra.dao.BaseDao;

import org.apache.ibatis.annotations.Param;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author JT
 * @since 2021-07-26
 */
public interface FormValidationDao extends BaseDao<FormValidationEntity> {

    FormValidationEntity selectByProcessId(@Param("processId") long processId);

}



package com.srm.bpm.infra.dao;

import com.srm.bpm.infra.entity.FormSettingEntity;
import com.srm.common.base.infra.dao.BaseDao;

import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * 表单设置 Mapper 接口
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface FormSettingDao extends BaseDao<FormSettingEntity> {

    FormSettingEntity selectByProcess(@Param("processId") long processId);
}

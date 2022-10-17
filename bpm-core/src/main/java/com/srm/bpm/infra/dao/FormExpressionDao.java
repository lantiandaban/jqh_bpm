

package com.srm.bpm.infra.dao;

import org.apache.ibatis.annotations.Param;

import java.util.List;

import com.srm.bpm.infra.entity.FormExpressionEntity;
import com.srm.common.base.infra.dao.BaseDao;
import com.srm.bpm.infra.entity.FormExtensionsEntity;

/**
 * <p>
 * 表单表达式 Mapper 接口
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface FormExpressionDao extends BaseDao<FormExpressionEntity> {

    /**
     * 根据业务流程ID获取扩展功能接口
     * @param processId 业务流程id
     * @return 扩展功能集合
     */
    List<FormExtensionsEntity> selectByProcessId(@Param("processId") long processId);
}

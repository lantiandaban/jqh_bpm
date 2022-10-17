

package com.srm.bpm.infra.dao;

import org.apache.ibatis.annotations.Param;

import java.util.List;

import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.common.base.infra.dao.BaseDao;

/**
 * <p>
 * 表单字段 Mapper 接口
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface FormFieldDao extends BaseDao<FormFieldEntity> {

    List<FormFieldEntity> selectByProcessIdAndXtype( @Param("processId") long processId,
                                                     @Param("xtype") String xtype);

    /**
     * 根据业务流程主键获取表单字段配置
     *
     * @param processId 业务流程主键
     * @return 表单字段配置
     */
    List<FormFieldEntity> selectByProcessId(@Param("processId") long processId);
}

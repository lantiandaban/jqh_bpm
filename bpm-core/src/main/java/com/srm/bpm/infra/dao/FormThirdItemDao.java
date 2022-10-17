

package com.srm.bpm.infra.dao;

import com.srm.bpm.infra.entity.FormThirdItemEntity;
import com.srm.common.base.infra.dao.BaseDao;

import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author JT
 * @since 2021-07-15
 */
public interface FormThirdItemDao extends BaseDao<FormThirdItemEntity> {

    List<FormThirdItemEntity> selectItemByProcessId(@Param("processId") Long processId);

    void physicalDeleteByThirdId(@Param("thirdId") Long id);
}

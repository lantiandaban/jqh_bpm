

package com.srm.bpm.infra.service;

import java.util.List;

import com.srm.common.base.infra.service.BaseService;
import com.srm.bpm.infra.entity.ProcessNodeFormFieldEntity;
import com.srm.bpm.infra.po.FormPermissionPO;

/**
 * <p>
 * 流程节点表单字段控制表 服务类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
public interface ProcessNodeFormFieldService extends BaseService<ProcessNodeFormFieldEntity> {

    /**
     * 保存或者更新节点字段控制
     *
     * @param nodeFormFields 节点字段信息表
     * @param processId      流程ID
     * @return 是否操作成功
     */
    void saveOrUpdate(List<ProcessNodeFormFieldEntity> nodeFormFields, long processId);

    /**
     * 获取表单字段权限
     *
     * @param processId 业务流程主键
     * @param nodeId    节点ID
     * @return 字段权限
     */
    List<FormPermissionPO> nodeFieldPermission(long processId, String nodeId);

    /**
     * 通过业务流程主键和节点id获取节点的表单字段设置
     * @param processId 业务流程主键
     * @param nodeId 任务节点ID
     * @return 表单字段权限设置
     */
    List<ProcessNodeFormFieldEntity> selectByProcessIdAndNodeId(long processId, String nodeId);
}

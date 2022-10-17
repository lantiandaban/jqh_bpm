 

package com.srm.bpm.infra.service.impl;

import com.google.common.base.Strings;
import com.google.common.collect.Lists;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.srm.bpm.infra.dao.ProcessNodeFormFieldDao;
import com.srm.bpm.infra.entity.ProcessNodeFormFieldEntity;
import com.srm.bpm.infra.po.FormPermissionPO;
import com.srm.bpm.infra.service.ProcessNodeFormFieldService;
import com.srm.common.base.infra.service.impl.BaseServiceImpl;
import com.srm.common.data.exception.RbException;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

import cn.hutool.core.collection.CollectionUtil;

/**
 * <p>
 * 流程节点表单字段控制表 服务实现类
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Service
public class ProcessNodeFormFieldServiceImpl extends BaseServiceImpl<ProcessNodeFormFieldDao, ProcessNodeFormFieldEntity> implements ProcessNodeFormFieldService {

    /**
     * 保存或者更新节点字段控制
     *
     * @param nodeFormFields 节点字段信息表
     * @param processId      流程ID
     * @return 是否操作成功
     */
    @Override
    public void saveOrUpdate(List<ProcessNodeFormFieldEntity> nodeFormFields, long processId) {
        this.remove(Wrappers.lambdaQuery(ProcessNodeFormFieldEntity.class).eq(ProcessNodeFormFieldEntity::getProcessId, processId));
        if(CollectionUtil.isNotEmpty(nodeFormFields)) {
            final boolean insertState = this.saveBatch(nodeFormFields);
            if (!insertState) {
                throw new RbException("process node formfield save has error!");
            }
        }
    }

    /**
     * 获取表单字段权限
     *
     * @param processId 业务流程主键
     * @param nodeId    节点ID
     * @return 字段权限
     */
    @Override
    public List<FormPermissionPO> nodeFieldPermission(long processId, String nodeId) {
        if (!Strings.isNullOrEmpty(nodeId)) {
            final LambdaQueryWrapper<ProcessNodeFormFieldEntity> queryWrapper =
                    Wrappers.lambdaQuery(ProcessNodeFormFieldEntity.class).eq(ProcessNodeFormFieldEntity::getProcessId, processId)
                            .eq(ProcessNodeFormFieldEntity::getNodeId, nodeId);
            final List<ProcessNodeFormFieldEntity> nodeFormFields = this.list(queryWrapper);
            if (CollectionUtil.isNotEmpty(nodeFormFields)) {
                List<FormPermissionPO> permissionVOS = Lists.newArrayList();
                for (ProcessNodeFormFieldEntity nodeFormField : nodeFormFields) {
                    FormPermissionPO permissionVO = new FormPermissionPO();
                    permissionVO.setHidden(nodeFormField.getVisibleFlag() != 1);
                    permissionVO.setEdit(nodeFormField.getEditFlag() == 1);
                    permissionVO.setWidgetName(nodeFormField.getFormWidgetName());
                    permissionVOS.add(permissionVO);
                }
                return permissionVOS;
            }
        }
        return Collections.emptyList();
    }

    /**
     * 通过业务流程主键和节点id获取节点的表单字段设置
     *
     * @param processId 业务流程主键
     * @param nodeId    任务节点ID
     * @return 表单字段权限设置
     */
    @Override
    public List<ProcessNodeFormFieldEntity> selectByProcessIdAndNodeId(long processId, String nodeId) {
        if (processId <= 0 || Strings.isNullOrEmpty(nodeId)) {
            return Collections.emptyList();
        }
        return this.list(Wrappers.lambdaQuery(ProcessNodeFormFieldEntity.class).eq(ProcessNodeFormFieldEntity::getProcessId, processId)
                .eq(ProcessNodeFormFieldEntity::getNodeId, nodeId));
    }
}

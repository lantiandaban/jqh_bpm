

package com.srm.bpm.logic.service.impl;

import com.google.common.base.MoreObjects;
import com.google.common.collect.Lists;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.enums.SqlLike;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.core.toolkit.sql.SqlUtils;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.bpm.infra.entity.ProcessTypeEntity;
import com.srm.bpm.infra.po.ProcessGridPO;
import com.srm.bpm.infra.service.ProcessTypeService;
import com.srm.bpm.infra.service.ToaProcessService;
import com.srm.bpm.logic.converts.ProcessBasicConvert;
import com.srm.bpm.logic.dto.ProcessTypeDTO;
import com.srm.bpm.logic.service.ProcessTypeLogic;
import com.srm.bpm.logic.vo.ProcessTypeVO;
import com.srm.bpm.logic.vo.ProcessVO;
import com.srm.config.TenantProperties;
import com.srm.common.data.exception.RbException;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.lang.Pair;
import lombok.RequiredArgsConstructor;

import static com.srm.bpm.logic.error.BillCode.PROCESS_CATEGORY_CODE_EXIST;
import static com.srm.bpm.logic.error.BillCode.PROCESS_CATEGORY_NAME_EXIST;


/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Service
@RequiredArgsConstructor
public class ProcessTypeLogicImpl implements ProcessTypeLogic {
    private final TenantProperties tenantProperties;
    private final ProcessTypeService processTypeService;
    private final ToaProcessService processService;
    private final ProcessBasicConvert processBasicConvert;

    /**
     * 分页查询流程分类
     *
     * @param pageNo   当前页
     * @param pageSize 页容量
     * @return 数据和总数
     */
    @Override
    public Pair<List<ProcessTypeDTO>, Long> getProcessTypeByPage(Integer pageNo, Integer pageSize) {
        final Page<ProcessTypeEntity> page = processTypeService.page(new Page<>(pageNo, pageSize));
        List<ProcessTypeDTO> list = processBasicConvert.processTypesEntityToDTO(page.getRecords());
        return new Pair<>(list, page.getTotal());
    }

    /**
     * 获取流程分类明细
     *
     * @param id 流程分类id
     * @return 分类数据
     */
    @Override
    public ProcessTypeDTO getDetail(Long id) {
        final ProcessTypeEntity typeEntity = processTypeService.getById(id);
        return processBasicConvert.processTypeEntityToDTO(typeEntity);
    }

    /**
     * 批量删除流程分类
     *
     * @param idList 流程id集合
     * @return 是否成功
     */
    @Override
    public boolean batchDeleteByIds(List<String> idList) {
        return processTypeService.removeByIds(idList);
    }

    /**
     * 保存流程分类
     *
     * @param processType 流程分类对象
     * @return 是否成功
     */
    @Override
    public boolean save(ProcessTypeDTO processType) {
        ProcessTypeEntity processTypeEntity = processBasicConvert.processTypeDTOToEntity(processType);
        final LambdaQueryWrapper<ProcessTypeEntity> queryWrapper = Wrappers.lambdaQuery(ProcessTypeEntity.class);
        if (Objects.isNull(processType.getId()) || processType.getId().compareTo(0L) <= 0) {
            //表示新增
            queryWrapper.eq(ProcessTypeEntity::getCode, processType.getCode());
            ProcessTypeEntity one = processTypeService.getOne(queryWrapper);
            if (!Objects.isNull(one)) {
                throw new RbException(PROCESS_CATEGORY_CODE_EXIST);
            }
            queryWrapper.clear();
            queryWrapper.eq(ProcessTypeEntity::getName, processType.getName().trim());
            one = processTypeService.getOne(queryWrapper);
            if (!Objects.isNull(one)) {
                throw new RbException(PROCESS_CATEGORY_NAME_EXIST);
            }
            processTypeEntity.setId(IdWorker.getId());
            return processTypeService.insert(processTypeEntity);
        } else {
            //表示修改
            queryWrapper.eq(ProcessTypeEntity::getCode, processType.getCode()).ne(ProcessTypeEntity::getId, processType.getId());
            ProcessTypeEntity one = processTypeService.getOne(queryWrapper);
            if (!Objects.isNull(one)) {
                throw new RbException(PROCESS_CATEGORY_CODE_EXIST);
            }
            queryWrapper.clear();
            queryWrapper.eq(ProcessTypeEntity::getName, processType.getName().trim()).ne(ProcessTypeEntity::getId, processType.getId());
            one = processTypeService.getOne(queryWrapper);
            if (!Objects.isNull(one)) {
                throw new RbException(PROCESS_CATEGORY_NAME_EXIST);
            }
            return processTypeService.upldate(processTypeEntity);
        }
    }

    /**
     * 按照分组的形式 获取所有的业务流程清单
     *
     * @param userCode 请求用户编码
     * @return 分组形式的业务类型列表
     */
    @Override
    public List<ProcessTypeVO> selectAllWithTypeGroup(String userCode, Set<String> orgs, String bloc, String name) {
        final LambdaQueryWrapper<ProcessTypeEntity> wrapper = Wrappers.lambdaQuery(ProcessTypeEntity.class);
        if (tenantProperties.getEnable()) {
            wrapper.eq(ProcessTypeEntity::getBlocCode, bloc);
        }
        final List<ProcessTypeEntity> processTypes = processTypeService.list(wrapper);
        if (CollectionUtil.isNotEmpty(processTypes)) {
            final int processTypeSize = processTypes.size();
            final List<ProcessTypeVO> types = Lists.newArrayListWithCapacity(processTypeSize);
            final String likeName = SqlUtils.concatLike(name, SqlLike.DEFAULT);
            final List<ProcessGridPO> processes = this.processService.findAllByUserCode(userCode, orgs, bloc, likeName);
            if (CollectionUtil.isNotEmpty(processes)) {
                // 对业务流程进行类型分组
                final Map<Long, List<ProcessGridPO>> groupTypeProcess = processes.stream().collect(Collectors.groupingBy(ProcessGridPO::getTypeId));
                for (ProcessTypeEntity processType : processTypes) {
                    final long typeId = MoreObjects.firstNonNull(processType.getId(), 0L);
                    final List<ProcessGridPO> elements = groupTypeProcess.get(typeId);
                    List<ProcessVO> processList = Lists.newArrayList();
                    if (CollectionUtil.isEmpty(elements)) {
                        // 如果没有业务流程，则不显示到页面中
                        continue;
                    }
                    processList.addAll(processBasicConvert.processGridPOToVO(elements));
                    ProcessTypeVO processTypeVO = voProcessType(processType, typeId);
                    processTypeVO.setFlows(processList);
                    types.add(processTypeVO);
                }
            } else {
                for (ProcessTypeEntity processType : processTypes) {
                    final long typeId = MoreObjects.firstNonNull(processType.getId(), 0L);
                    ProcessTypeVO processTypeVO = voProcessType(processType, typeId);
                    types.add(processTypeVO);
                }
            }

            return types;
        }

        return Collections.emptyList();
    }

    @Override
    public List<com.srm.bpm.facde.dto.ProcessTypeDTO> getAllType() {
        final List<ProcessTypeEntity> list = processTypeService.list();
        return processBasicConvert.processTypeEntityToDTO(list);
    }

    private ProcessTypeVO voProcessType(ProcessTypeEntity processType, long typeId) {
        ProcessTypeVO processTypeVO;
        if (typeId <= 0) {
            processTypeVO = new ProcessTypeVO();
            processTypeVO.setCode("0000");
            processTypeVO.setName("其他");
            processTypeVO.setId(0L);
        } else {
            processTypeVO = new ProcessTypeVO();
            processTypeVO.setCode(processType.getCode());
            processTypeVO.setName(processType.getName());
            processTypeVO.setId(processType.getId());
        }
        return processTypeVO;
    }
}



package com.srm.bpm.logic.service;

import com.srm.bpm.facde.dto.BaseProcessDTO;
import com.srm.bpm.facde.dto.ProcessGridDTO;

import java.util.List;
import java.util.Map;

import cn.hutool.core.lang.Pair;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface ProcessFlowLogic {
    /**
     * 分页查询流程信息
     *
     * @param pageNo   当前页
     * @param pageSize 页容量
     * @return 数据和总数
     */
    Pair<List<ProcessGridDTO>, Long> getProcessFlowByPage(Integer pageNo, Integer pageSize, Map<String, Object> params,String bloc);

    /**
     * 保存流程基本信息
     *
     * @param process 流程对象
     * @return 是否成功
     */
    boolean saveProcess(BaseProcessDTO process,String bloc);

    /**
     * 删除流程信息
     *
     * @param processId 流程id
     * @return 是否成功
     */
    boolean removeProcess(long processId);


    /**
     * 撤回流程
     *
     * @param processId 流程
     * @return 是否成功
     */
    boolean cancelProcess(long processId);

    /**
     * 启用流程
     *
     * @param processId 流程
     * @return 是否成功
     */
    boolean enableProcess(long processId);

    /**
     * 禁用流程
     *
     * @param processId 流程
     * @return 禁用结果
     */
    boolean disableProcess(long processId);

    /**
     * 发布流程
     *
     * @param processId 流程id
     * @return 是否成功
     */
    boolean releaseProcess(long processId);

    /**
     * 开始使用流程
     *
     * @param processId 流程id
     * @return 是否成功
     */
    boolean openProcess(long processId);

    /**
     * 关闭流程
     *
     * @param processId 流程id
     * @return 是否成功
     */
    boolean closeProcess(long processId);

    /**
     * 获取单个流程的基础信息
     * @param id 流程id
     * @return 基础信息
     */
    BaseProcessDTO getBaseInfo(Long id);

    /**
     * 获取流程的打印模版绝对地址
     * @param processId 流程id
     * @return  打印模版绝对地址
     */
    String getPrintTmp(Long processId);
}

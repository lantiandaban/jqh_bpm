

package com.srm.bpm.logic.service;

import com.srm.bpm.logic.dto.ProcessTypeDTO;
import com.srm.bpm.logic.vo.ProcessTypeVO;

import java.util.List;
import java.util.Set;

import cn.hutool.core.lang.Pair;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface ProcessTypeLogic {
    /**
     * 分页查询流程分类
     *
     * @param pageNo   当前页
     * @param pageSize 页容量
     * @return 数据和总数
     */
    Pair<List<ProcessTypeDTO>, Long> getProcessTypeByPage(Integer pageNo, Integer pageSize);

    /**
     * 获取流程分类明细
     *
     * @param id 流程分类id
     * @return 分类数据
     */
    ProcessTypeDTO getDetail(Long id);

    /**
     * 批量删除流程分类
     *
     * @param idList 流程id集合
     * @return 是否成功
     */
    boolean batchDeleteByIds(List<String> idList);

    /**
     * 保存流程分类
     *
     * @param processType 流程分类对象
     * @return 是否成功
     */
    boolean save(ProcessTypeDTO processType);

    /**
     * 按照分组的形式 获取所有的业务流程清单
     *
     * @param userCode 请求用户编码
     * @return 分组形式的业务类型列表
     */
    List<ProcessTypeVO> selectAllWithTypeGroup(String userCode, Set<String> orgs, String bloc,String name);

    List<com.srm.bpm.facde.dto.ProcessTypeDTO> getAllType();


}

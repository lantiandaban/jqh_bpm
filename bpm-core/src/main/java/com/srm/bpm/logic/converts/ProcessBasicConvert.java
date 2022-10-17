 

package com.srm.bpm.logic.converts;

import com.srm.bpm.facde.dto.BaseProcessDTO;
import com.srm.bpm.facde.dto.ProcessDTO;
import com.srm.bpm.facde.dto.ProcessGridDTO;
import com.srm.bpm.facde.dto.ProcessTypeDTO;
import com.srm.bpm.infra.entity.ProcessDesingerEntity;
import com.srm.bpm.infra.entity.ProcessTypeEntity;
import com.srm.bpm.infra.entity.ToaProcessEntity;
import com.srm.bpm.infra.po.ProcessGridPO;
import com.srm.bpm.logic.dto.ProcessDesingerDTO;
import com.srm.bpm.logic.dto.ProcessDetailDTO;
import com.srm.bpm.logic.vo.ProcessTypeVO;
import com.srm.bpm.logic.vo.ProcessVO;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Mapper(componentModel = "spring")
public interface ProcessBasicConvert {

    List<ProcessDTO> processVOtoDTO(List<ProcessVO> flows);

    ProcessDetailDTO processDetailEntityToDTO(ToaProcessEntity processEntity);

    ProcessDesingerDTO processDesingerEntityToDTO(ProcessDesingerEntity desingerEntity);

    ProcessTypeDTO processTypeVOToDTO(ProcessTypeVO processType);

    ProcessTypeEntity processTypeDTOToEntity(com.srm.bpm.logic.dto.ProcessTypeDTO processTypeDTO);

    List<com.srm.bpm.logic.dto.ProcessTypeDTO> processTypesEntityToDTO(List<ProcessTypeEntity> processType);

    com.srm.bpm.logic.dto.ProcessTypeDTO processTypeEntityToDTO(ProcessTypeEntity processType);

    List<ProcessGridDTO> processGridPOToDTO(List<ProcessGridPO> list);

    ToaProcessEntity baseProcessDTOToEntity(BaseProcessDTO baseProcessDTO);


    @Mapping(source = "displayName",target = "name")
    ProcessVO processGridPOToProcessVO(ProcessGridPO processGridPO);

    List<ProcessVO> processGridPOToVO(List<ProcessGridPO> processGridPOS);

    List<ProcessTypeDTO> processTypeEntityToDTO(List<ProcessTypeEntity> processTypeEntities);

    BaseProcessDTO processEntityToDTO(ToaProcessEntity byId);

    List<ProcessTypeDTO> processTypeVOToDTOs(List<ProcessTypeVO> result);
}

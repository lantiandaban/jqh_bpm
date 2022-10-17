

package com.srm.bpm.logic.converts;

import com.srm.bpm.infra.entity.FormDesingerEntity;
import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.bpm.infra.entity.FormThirdItemEntity;
import com.srm.bpm.infra.po.FormFieldPO;
import com.srm.bpm.infra.po.FormPermissionPO;
import com.srm.bpm.logic.dto.FormDesingerDTO;
import com.srm.bpm.logic.dto.FormThirdItemDTO;
import com.srm.bpm.logic.vo.FormFieldVO;
import com.srm.bpm.logic.vo.FormPermissionVO;

import org.mapstruct.Mapper;

import java.util.List;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Mapper(componentModel = "spring")
public interface FormBasicConvert {

    List<FormPermissionVO> formPermissionPOtoVO(List<FormPermissionPO> permissionPOS);

    FormDesingerDTO formDesingerEntityToDTO(FormDesingerEntity formDesingerEntity);

    FormFieldPO formFieldEntityToPO(FormFieldEntity field);

    List<FormThirdItemEntity> formThirdItemDTOToEntity(List<FormThirdItemDTO> formThirdItemDTOS);
    List<FormFieldVO> FormFieldPOToVO(List<FormFieldPO> formFieldPOS);
}



package com.srm.bpmserver.logic.converts;

import com.srm.bpm.logic.dto.ZTreeDTO;
import com.srm.bpmserver.infra.po.OrganizationPO;
import com.srm.bpmserver.infra.po.PositionPO;
import com.srm.bpmserver.infra.po.PositionUserPO;

import org.mapstruct.Mapper;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Mapper(componentModel = "spring")
public interface TreeConvert {

    ZTreeDTO organizationPOToDTO(OrganizationPO organizationPO);

    ZTreeDTO positionUserPOToDTO(PositionUserPO positionUserPO);

    ZTreeDTO positionPOToDTO(PositionPO positionPO);
}

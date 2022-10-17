

package com.srm.bpm.logic.converts;

import com.srm.bpm.facde.dto.DatasourceDTO;
import com.srm.bpm.infra.entity.DatasourceComboEntity;
import com.srm.bpm.infra.entity.DatasourceConditionsEntity;
import com.srm.bpm.infra.entity.DatasourceFiledEntity;
import com.srm.bpm.infra.entity.DatasourcePopoverEntity;
import com.srm.bpm.infra.entity.ToaDatasourceEntity;
import com.srm.bpm.infra.po.TableFieldPO;
import com.srm.bpm.logic.dto.DatasourceComboDTO;
import com.srm.bpm.logic.dto.DatasourceConditionDTO;
import com.srm.bpm.logic.dto.DatasourceFiledDTO;
import com.srm.bpm.logic.dto.DatasourcePopoverDTO;
import com.srm.bpm.logic.dto.ZZTableField;

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
public interface DataSourceBasicConvert {

    DatasourceDTO datasourceEntityToDTO(ToaDatasourceEntity datasourceEntity);

    List<DatasourceDTO> datasourcesEntityToDTO(List<ToaDatasourceEntity> records);

    DatasourcePopoverDTO datasourcePopoverEntityToDTO(DatasourcePopoverEntity datasourcePopoverEntity);

    DatasourceComboDTO datasourceComboEntityToDTO(DatasourceComboEntity datasourceComboEntity);

    List<DatasourceConditionDTO> datasourceConditionsEntityToDTO(List<DatasourceConditionsEntity> conditionsEntities);

    ToaDatasourceEntity datasourceDTOToEntity(DatasourceDTO dto);

    List<DatasourceFiledEntity> datasourceFiledDTOToEntity(List<DatasourceFiledDTO> datasourceFiledDTOS);

    List<DatasourceConditionsEntity> datasourceConditionDTOToEntity(List<DatasourceConditionDTO> conditions);

    DatasourceComboEntity datasourceComboDTOToEntity(DatasourceComboDTO combo);

    DatasourcePopoverEntity datasourcePopoverDTOToEntity(DatasourcePopoverDTO popover);

    List<ZZTableField> tableFieldPOToField(List<TableFieldPO> fieldPOS);

}

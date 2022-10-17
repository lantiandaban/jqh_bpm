

package com.srm.bpm.logic.converts;

import com.srm.bpm.facde.dto.BillItemDTO;
import com.srm.bpm.facde.dto.BillTaskDTO;
import com.srm.bpm.infra.po.BillApprovalHistoryPO;
import com.srm.bpm.infra.po.ProcessDetailPO;
import com.srm.bpm.logic.dto.ProcessDetailDTO;
import com.srm.bpm.logic.vo.BillApprovalHistoryVO;
import com.srm.bpm.logic.vo.BillItemVO;
import com.srm.bpm.logic.vo.BillTaskVO;

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
public interface BillBasicConvert {
    BillItemDTO billItemVOToDTO(BillItemVO billItem);
    List<BillItemDTO> billItemsVOToDTO(List<BillItemVO> billItem);
    List<BillTaskDTO> billTaskVOToDTO(List<BillTaskVO> billTaskVOS);
    List<BillApprovalHistoryVO> billApprovalHistoryPOToVO(List<BillApprovalHistoryPO> billApprovalHistoryPOS);

    ProcessDetailDTO billPOToDTO(ProcessDetailPO process);

    List<BillTaskVO> billTasksDTOToVO(List<com.srm.bpm.logic.dto.BillTaskDTO> billTaskDTOS);

}

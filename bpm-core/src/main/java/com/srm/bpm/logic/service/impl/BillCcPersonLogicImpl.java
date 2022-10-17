

package com.srm.bpm.logic.service.impl;

import com.google.common.base.Optional;
import com.google.common.collect.Lists;

import com.srm.bpm.infra.entity.BillCcPersonEntity;
import com.srm.bpm.infra.entity.ProcessNodeExtendEntity;
import com.srm.bpm.infra.entity.ToaProcessEntity;
import com.srm.bpm.infra.service.BillCcPersonService;
import com.srm.bpm.infra.service.ProcessNodeExtendService;
import com.srm.bpm.infra.service.ToaProcessService;
import com.srm.bpm.logic.service.BillCcPersonLogic;
import com.srm.common.data.exception.RbException;
import com.srm.common.util.datetime.DateTimeUtil;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@RequiredArgsConstructor
@Service
@Slf4j
public class BillCcPersonLogicImpl implements BillCcPersonLogic {
    private final ToaProcessService processService;
    private final ProcessNodeExtendService nodeExtendService;
    private final BillCcPersonService billCcPersonService;

    @Override
    public void saveBillCc(Set<String> ccUsers, long billId, String nodeId, String flowId) {
        java.util.Optional<ToaProcessEntity> process = processService.getByFlowId(flowId);
        if (!process.isPresent()) {
            throw new RbException("流程不存在！");
        }
        long processId = process.get().getId();
        Optional<ProcessNodeExtendEntity> nodeExtendOptional = nodeExtendService.findByFlowIdAndNodeId(nodeId,
                flowId);
        String nodeName = "";
        if (nodeExtendOptional.isPresent()) {
            ProcessNodeExtendEntity nodeExtend = nodeExtendOptional.get();
            nodeName = nodeExtend.getNodeName();
        }
        List<BillCcPersonEntity> billCcPeople = Lists.newArrayList();
        BillCcPersonEntity billCcPerson;
        for (String ccUser : ccUsers) {
            billCcPerson = new BillCcPersonEntity();
            billCcPerson.setBillId(billId);
            billCcPerson.setCreationTime(LocalDateTime.now());
            billCcPerson.setIsDeleted(0);
            billCcPerson.setUserCode(ccUser);
            billCcPerson.setProcessId(processId);
            billCcPerson.setNodeName(nodeName);
            billCcPerson.setDateline(DateTimeUtil.unixTime());
            billCcPeople.add(billCcPerson);
        }
        boolean isOk = billCcPersonService.saveBatch(billCcPeople);
        if (!isOk) {
            throw new RbException("保存审批抄送人失败！");
        }
    }
}

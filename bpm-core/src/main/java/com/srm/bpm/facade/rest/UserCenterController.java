

package com.srm.bpm.facade.rest;

import com.google.common.base.MoreObjects;

import com.srm.bpm.logic.dto.DataTablesInputDTO;
import com.srm.bpm.logic.dto.DataTablesOutputDTO;
import com.srm.bpm.logic.dto.UserChooseDTO;
import com.srm.bpm.logic.query.UserChooseQuery;
import com.srm.bpm.logic.service.UserCenterlogic;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import javax.validation.Valid;

import cn.hutool.core.lang.Pair;
import lombok.RequiredArgsConstructor;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/user/center")
public class UserCenterController {
    private final UserCenterlogic userCenterlogic;

    /**
     * 使用datatable做员工选择
     *
     * @param dataTablesInput 表格参数
     * @return 查询集合
     */
    @PostMapping("/datagrids")
    public DataTablesOutputDTO<UserChooseDTO> datatables(
            @Valid @RequestBody DataTablesInputDTO dataTablesInput
    ) {
        if (dataTablesInput.getLength() == -1) {
            dataTablesInput.setStart(0);
            dataTablesInput.setLength(Integer.MAX_VALUE);
        }
        UserChooseQuery query = dataTablesInput.getParams()
                .toJavaObject(UserChooseQuery.class);
        final int start = MoreObjects.firstNonNull(dataTablesInput.getStart(), 0);
        int current = start / dataTablesInput.getLength();
        Pair<List<UserChooseDTO>, Long> result = userCenterlogic.getChooseUsers(current, dataTablesInput.getLength(),query);
        DataTablesOutputDTO<UserChooseDTO> dataTablesOutput = new DataTablesOutputDTO<>();
        dataTablesOutput.setRecordsTotal(result.getValue());
        dataTablesOutput.setRecordsFiltered(result.getValue());
        dataTablesOutput.setData(result.getKey());
        return dataTablesOutput;
    }
}

 

package com.srm.bpm.logic.service.impl;

import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.bpm.infra.entity.BillReplyEntity;
import com.srm.bpm.infra.service.BillReplyService;
import com.srm.bpm.logic.dto.BillReplyDTO;
import com.srm.bpm.logic.dto.UserInfoDTO;
import com.srm.bpm.logic.service.BillReplyLogic;
import com.srm.bpm.logic.service.UserCenterlogic;
import com.srm.bpm.logic.service.LoginUserHolder;
import com.srm.common.util.datetime.DateTimeUtil;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.lang.Pair;
import lombok.RequiredArgsConstructor;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Service
@RequiredArgsConstructor
public class BillReplyLogicImpl implements BillReplyLogic {
    private final BillReplyService billReplyService;
    private final UserCenterlogic userCenterlogic;
    private final LoginUserHolder loginUserHolder;


    @Override
    public Pair<List<BillReplyDTO>, Long> findByBillId(Integer page, Integer pageSize, Long billId) {
        Page<BillReplyEntity> pag = new Page<>(page, pageSize);
        final LambdaQueryWrapper<BillReplyEntity> eq =
                Wrappers.lambdaQuery(BillReplyEntity.class).eq(BillReplyEntity::getBillId, billId);
        final Page<BillReplyEntity> page1 = billReplyService.page(pag, eq);
        final List<BillReplyEntity> records = page1.getRecords();
        final Set<String> userCodes = records.stream().map(BillReplyEntity::getUserCode).collect(Collectors.toSet());
        final Map<String, String> codeNameMap = Maps.newConcurrentMap();
        if (CollectionUtil.isNotEmpty(userCenterlogic.getUserByCodes(userCodes))) {
            final List<UserInfoDTO> data = userCenterlogic.getUserByCodes(userCodes);
            codeNameMap.putAll(data.stream().collect(Collectors.toMap(UserInfoDTO::getCode, UserInfoDTO::getNickname)));
        }
        final String userCode = loginUserHolder.getUserCode();
        List<BillReplyDTO> result = Lists.newArrayList();
        for (BillReplyEntity record : records) {
            BillReplyDTO billReplyDTO = new BillReplyDTO();
            billReplyDTO.setId(record.getId());
            billReplyDTO.setContent(record.getContent());
            billReplyDTO.setDateline(record.getDateline());
            final String recordUserCode = record.getUserCode();
            billReplyDTO.setSelf(recordUserCode.equals(userCode));
            final String replyName = codeNameMap.get(recordUserCode);
            if (!Strings.isNullOrEmpty(replyName)) {
                billReplyDTO.setUserName(replyName);
            }
            result.add(billReplyDTO);
        }
        return Pair.of(result, page1.getTotal());
    }

    @Override
    public boolean deleteByBillId(long billId, long replyId) {
        return this.billReplyService.removeById(replyId);
    }

    @Override
    public BillReplyDTO submit(Long billId, String content) {

        final int unixTime = DateTimeUtil.unixTime();
        BillReplyEntity reply = new BillReplyEntity();
        reply.setBillId(billId);
        reply.setContent(content);
        reply.setDateline(unixTime);
        final String userCode = loginUserHolder.getUserCode();
        reply.setUserCode(userCode);

        final boolean insert = this.billReplyService.insert(reply);
        if (insert) {
            final BillReplyDTO replyDto = new BillReplyDTO();
            replyDto.setContent(content);
            replyDto.setDateline(unixTime);
            if (CollectionUtil.isNotEmpty(userCenterlogic.getUserByCodes(Sets.newHashSet(userCode)))) {
                replyDto.setUserName(userCenterlogic.getUserByCodes(Sets.newHashSet(userCode)).get(0).getNickname());
            }
            replyDto.setId(reply.getId());
            return replyDto;
        }
        return null;
    }
}

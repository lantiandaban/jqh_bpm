

package com.srm.bpmserver.logic.impl;

import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.common.base.infra.service.RedisService;
import com.srm.bpm.logic.dto.UserChooseDTO;
import com.srm.bpm.logic.dto.UserInfoDTO;
import com.srm.bpm.logic.dto.UserOrgDTO;
import com.srm.bpm.logic.dto.UserPositionDTO;
import com.srm.bpm.logic.dto.ZTreeDTO;
import com.srm.bpm.logic.query.UserChooseQuery;
import com.srm.bpm.logic.service.UserCenterlogic;
import com.srm.bpmserver.infra.dao.UserCenterDao;
import com.srm.bpmserver.infra.po.OrganizationPO;
import com.srm.bpmserver.infra.po.PositionPO;
import com.srm.bpmserver.infra.po.PositionUserPO;
import com.srm.bpmserver.infra.po.UserOrgPO;
import com.srm.bpmserver.logic.converts.TreeConvert;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.lang.Pair;
import cn.hutool.core.util.StrUtil;
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
public class UserCenterLogicImpl implements UserCenterlogic {
    private final UserCenterDao userCenterDao;
    private final RedisService redisService;
    private final TreeConvert treeConvert;

    @Override
    public List<ZTreeDTO> organization(String pid, String q) {
        //查询部门信息
        List<ZTreeDTO> zTreeDTOS = Lists.newArrayList();
        if (Strings.isNullOrEmpty(pid)) {
            ZTreeDTO topLevel = new ZTreeDTO();
            topLevel.setPid("ORG0");
            topLevel.setId("ORG0");
            topLevel.setName("组织机构树");
            topLevel.setNocheck(true);
            topLevel.setOpen(true);
            zTreeDTOS.add(topLevel);
        }
        final List<OrganizationPO> organizationPOS = userCenterDao.selectOrg(pid, q);
        for (OrganizationPO organizationPO : organizationPOS) {
            final ZTreeDTO zTreeDTO = treeConvert.organizationPOToDTO(organizationPO);
            zTreeDTO.setData(organizationPO);
            zTreeDTOS.add(zTreeDTO);
        }
        return zTreeDTOS;
    }

    @Override
    public List<ZTreeDTO> organizationUser(String pid, String q, boolean onlyChoiceUser) {
        List<ZTreeDTO> zTreeDTOS = this.organization(pid, q);
        for (ZTreeDTO zTreeDTO : zTreeDTOS) {
            zTreeDTO.setNocheck(onlyChoiceUser);
        }

        List<UserOrgPO> userOrgPOS = userCenterDao.selectUsers(pid);
        for (UserOrgPO userOrgPO : userOrgPOS) {
            final ZTreeDTO zTreeDTO = new ZTreeDTO();
            zTreeDTO.setId(userOrgPO.getId());
            zTreeDTO.setPid(userOrgPO.getOrgId());
            zTreeDTO.setName(userOrgPO.getName());
            zTreeDTO.setData(userOrgPO);
            zTreeDTOS.add(zTreeDTO);
        }
        return zTreeDTOS;
    }

    @Override
    public List<ZTreeDTO> positionUser(String pid) {
        final List<ZTreeDTO> position = this.position(pid, StrUtil.EMPTY);
        List<PositionUserPO> positionUserPOS = userCenterDao.selectPositionUser(pid);
        for (PositionUserPO positionUserPO : positionUserPOS) {
            final ZTreeDTO zTreeDTO = treeConvert.positionUserPOToDTO(positionUserPO);
            position.add(zTreeDTO);
        }
        return position;
    }

    @Override
    public List<ZTreeDTO> position(String pid, String s) {
        List<ZTreeDTO> zTreeDTOS = Lists.newArrayList();
        if (Strings.isNullOrEmpty(pid)) {
            ZTreeDTO topLevel = new ZTreeDTO();
            topLevel.setPid("0");
            topLevel.setId("0");
            topLevel.setName("职位树");
            topLevel.setNocheck(true);
            topLevel.setOpen(true);
            zTreeDTOS.add(topLevel);
        }
        List<PositionPO> positionPOS = userCenterDao.selectAllPosition(pid, s);
        for (PositionPO positionPO : positionPOS) {
            final ZTreeDTO zTreeDTO = treeConvert.positionPOToDTO(positionPO);
            zTreeDTO.setData(positionPO);
            zTreeDTOS.add(zTreeDTO);
        }
        return zTreeDTOS;
    }

    @Override
    public List<UserInfoDTO> getUserByCodes(Set<String> userCodes) {
        if(CollectionUtil.isEmpty(userCodes)) {
            return Collections.emptyList();
        }
        List<UserInfoDTO> userInfoDTOS = userCenterDao.selectUserInfoByUserId(userCodes);
        List<UserOrgDTO> userOrgDTOS = userCenterDao.selectUserOrgByUserId(userCodes);
        final Map<String, List<UserOrgDTO>> collect = userOrgDTOS.stream().collect(Collectors.groupingBy(UserOrgDTO::getUserId));
        for (UserInfoDTO userInfoDTO : userInfoDTOS) {
            final String id = userInfoDTO.getId();
            final List<UserOrgDTO> userOrgDTOS1 = collect.get(id);
            if (CollectionUtil.isNotEmpty(userOrgDTOS1)) {
                userInfoDTO.setOrgs(userOrgDTOS1);
            }
        }
        return userInfoDTOS;
    }

    @Override
    public Set<String> getOrgPositionUser(long positionId, String orgId) {
        return userCenterDao.selectUserByPositionAndOrg(positionId, orgId);
    }

    @Override
    public UserInfoDTO getUserInfoByCode(String userCode) {
        List<UserInfoDTO> userInfoDTOS = userCenterDao.selectUserInfoByUserId(Sets.newHashSet(userCode));
        if (CollectionUtil.isEmpty(userInfoDTOS)) {
            return null;
        }
        List<UserOrgDTO> userOrgDTOS = userCenterDao.selectUserOrgByUserId(Sets.newHashSet(userCode));
        final UserInfoDTO userInfoDTO = userInfoDTOS.get(0);
        userInfoDTO.setOrgs(userOrgDTOS);
        return userInfoDTO;
    }

    @Override
    public String getTokenByKey(String key) {
        return key;
    }

    @Override
    public List<UserPositionDTO> getUserPositionByUserAndOrg(String userId, long orgId) {
        return userCenterDao.selectUserPositionByUserAndOrg(userId, orgId);
    }

    @Override
    public Pair<List<UserChooseDTO>, Long> getChooseUsers(int current, Integer length, UserChooseQuery query) {
        Page pag = new Page<>(current, length);
        List<UserChooseDTO> userChooseDTOS = userCenterDao.findChooseUsers(pag, query);
        return Pair.of(userChooseDTOS, pag.getTotal());
    }

    /**
     * 查询通和的上级领导id
     *
     * @param userIds 用户的id
     * @return 上级领导id
     */
    @Override
    public Set<String> getLeaderIdByUserIds(List<String> userIds) {
        return Sets.newHashSet();
    }
}

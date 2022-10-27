

package com.srm.bpm.logic.service;

import com.srm.bpm.logic.dto.UserChooseDTO;
import com.srm.bpm.logic.dto.UserInfoDTO;
import com.srm.bpm.logic.dto.UserPositionDTO;
import com.srm.bpm.logic.dto.ZTreeDTO;
import com.srm.bpm.logic.query.UserChooseQuery;

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
public interface UserCenterlogic {
    List<ZTreeDTO> organization(String pid, String s, String state);

    List<ZTreeDTO> organizationUser(String pid, String q, boolean onlyChoiceUser, String state);

    List<ZTreeDTO> positionUser(String pid);


    List<ZTreeDTO> position(String pid, String s);

    List<UserInfoDTO> getUserByCodes(Set<String> userCodes);

    Set<String> getOrgPositionUser(long positionId, String orgId);

    UserInfoDTO getUserInfoByCode(String userCode);

    String getTokenByKey(String key);

    List<UserPositionDTO> getUserPositionByUserAndOrg(String userId, long orgId);

    Pair<List<UserChooseDTO>, Long> getChooseUsers(int current, Integer length, UserChooseQuery query);

    /**
     * 查询通和的上级领导id
     *
     * @param userIds 用户的id
     * @return 上级领导id
     */
    Set<String> getLeaderIdByUserIds(List<String> userIds);
}

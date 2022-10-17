

package com.srm.bpmserver.infra.dao;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.bpm.logic.dto.UserChooseDTO;
import com.srm.bpm.logic.dto.UserInfoDTO;
import com.srm.bpm.logic.dto.UserOrgDTO;
import com.srm.bpm.logic.dto.UserPositionDTO;
import com.srm.bpm.logic.query.UserChooseQuery;
import com.srm.bpmserver.infra.po.OrganizationPO;
import com.srm.bpmserver.infra.po.PositionPO;
import com.srm.bpmserver.infra.po.PositionUserPO;
import com.srm.bpmserver.infra.po.UserOrgPO;

import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Set;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface UserCenterDao {
    List<OrganizationPO> selectOrg(@Param("pid") String pid, @Param("q") String q);

    List<UserOrgPO> selectUsers(@Param("pid") String pid);

    List<PositionPO> selectAllPosition(@Param("pid") String pid, @Param("q") String s);

    List<PositionUserPO> selectPositionUser(@Param("pid") String pid);

    List<UserOrgDTO> selectUserOrgByUserId(@Param("userIds") Set<String> userIds);

    Set<String> selectUserByPositionAndOrg(@Param("positionId") long positionId, @Param("orgId") String orgId);

    List<UserInfoDTO> selectUserInfoByUserId(@Param("userIds") Set<String> userIds);

    List<UserPositionDTO> selectUserPositionByUserAndOrg(@Param("userId") String userId, @Param("orgId") long orgId);

    List<UserChooseDTO> findChooseUsers(Page pag, @Param("query") UserChooseQuery query);
}

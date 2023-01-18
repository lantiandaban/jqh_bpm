

package com.srm.bpmserver.logic.impl;

import com.google.common.collect.Sets;

import com.srm.bpm.logic.dto.UserOrgDTO;
import com.srm.bpm.logic.service.LoginUserHolder;
import com.srm.bpmserver.infra.dao.UserCenterDao;
import com.srm.common.data.constant.UserAuthConstant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import cn.hutool.core.collection.CollectionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LoginUserHolderImpl implements LoginUserHolder {
    @Lazy
    @Autowired
    private UserCenterDao userCenterDao;

    private final RedisTemplate<String, Object> redisTemplate;


    /**
     * 获取当前登录用户的编号
     *
     * @return 用户编号
     */
    @Override
    public String getUserCode() {
        //从Header中获取用户信息
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = servletRequestAttributes.getRequest();
        final String requestHeader = request.getHeader(UserAuthConstant.TOKEN_HEADER_NAME);
        String userId;
        //需要区分一下，如果用户消息头中是 ·bearer · 开头需要从redis取用户，如果不是说明直接是用户id
        if (Objects.isNull(requestHeader)) {
            userId = "";
        } else if (requestHeader.startsWith(UserAuthConstant.TOKEN_HEADER_PREFIX)) {
            final String header = requestHeader.replace(UserAuthConstant.TOKEN_HEADER_PREFIX, "");
            userId = (String) redisTemplate.opsForValue().get(header);
        } else {
            userId = requestHeader.replace(UserAuthConstant.TOKEN_HEADER_PREFIX, "");
        }
        return userId;
    }

    @Override
    public String getBloc() {
        return "";
    }

    @Override
    public Set<String> getUserOrgs() {
        final String userId = getUserCode();
        final List<UserOrgDTO> userOrgDTOS = userCenterDao.selectUserOrgByUserId(Sets.newHashSet(userId));
        if (CollectionUtil.isNotEmpty(userOrgDTOS)) {
            return userOrgDTOS.stream().map(a -> String.valueOf(a.getOrgId())).collect(Collectors.toSet());
        }
        return Collections.emptySet();
    }
}

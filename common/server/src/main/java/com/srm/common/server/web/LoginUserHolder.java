 

package com.srm.common.server.web;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import cn.hutool.core.util.StrUtil;
import com.srm.common.data.auth.UserInfo;
import com.srm.common.util.serialize.JsonMapper;

import static com.srm.common.data.constant.UserAuthConstant.CURRENT_ROLE;
import static com.srm.common.data.constant.UserAuthConstant.HEADER_USER;

/**
 * @author fitz.yang
 * @version 2021.02
 * @since scis 2021.02
 */
public class LoginUserHolder {

    private LoginUserHolder() {
    }

    public static Optional<UserInfo> currentUser() {
        //从Header中获取用户信息
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = servletRequestAttributes.getRequest();
        String userJson = request.getHeader(HEADER_USER);
        if (StrUtil.isEmpty(userJson)) {
            return Optional.empty();
        }
        return JsonMapper.fromJson(userJson, UserInfo.class);
    }

    public static String getUserCode() {
        final Optional<UserInfo> userInfo = currentUser();
        if (!userInfo.isPresent()) {
            return null;
        }
        return userInfo.get().getCode();
    }

    public static Set<String> getUserOrgs() {
        final Optional<UserInfo> userInfo = currentUser();
        if (!userInfo.isPresent()) {
            return null;
        }

        return userInfo.get().getOrgCodes();
    }

    public static Set<String> getSubOrgs() {
        final Optional<UserInfo> userInfo = currentUser();
        if (!userInfo.isPresent()) {
            return null;
        }
        return userInfo.get().getSubOrgCodes();
    }

    public static String getBloc() {
        final Optional<UserInfo> userInfo = currentUser();
        if (!userInfo.isPresent()) {
            //return null;
            return "sys";
        }
        return userInfo.get().getBloc()==null?"sys":userInfo.get().getBloc();
    }

    public static List<String> getRoles() {
        final Optional<UserInfo> userInfo = currentUser();
        if (!userInfo.isPresent()) {
            return null;
        }
        return userInfo.get().getRoles();
    }

    public static String getCurrentRole() {
        //从Header中获取用户当前的角色编号
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = servletRequestAttributes.getRequest();
        String currentRole = request.getHeader(CURRENT_ROLE);
        if (StrUtil.isEmpty(currentRole)) {
            return "";
        }
        return currentRole;
    }

}

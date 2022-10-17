

package com.srm.bpm.logic.service;

import java.util.Set;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface LoginUserHolder {
    /**
     * 获取当前登录用户的编号
     *
     * @return 用户编号
     */
    String getUserCode();

    String getBloc();


    Set<String> getUserOrgs();


}

 

package com.srm.common.data.constant;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface UserAuthConstant {
    String RESOURCE_ROLES_MAP = "AUTH:RESOURCE_ROLES_MAP";
    String ROUTER_CODE_MAP = "AUTH:ROUTER_CODE_MAP";
    String DATAPERM_ROLES_MAP = "AUTH:DATAPERM_ROLES_MAP";

    String USER_MAP = "AUTH:USER_MAP";
    String USER_TOKEN_EXP = "AUTH:TOKEN_";
    String TOKEN_HEADER_NAME = "Authorization";
    String ROLE_HEADER_NAME = "role";
    String TOKEN_HEADER_PREFIX = "bearer ";

    String AUTHORITY_PREFIX = "ROLE_";


    String AUTHORITY_CLAIM_NAME = "authorities";

    String HEADER_USER = "user";
    String DATA_PERMS = "dataperms";
    String CURRENT_ROLE = "currentrole";

    String ACCESS_TICKET_PREFIX = "AUTH:ACCESS_TICKET_PREFIX";

    String TMP_TOKEN_KEY = "AUTH:TMP_TOKEN_";

    /**
     * 系统平台编码
     */
    String SYS_BLOC_CODE = "sys";

    String USER_BLOCK_SEPARATE = "_@@_";

    /**
     * 系统默认密码
     */
    String DEFAULT_PWD = "111111";
}



package com.srm.bpmserver.infra.po;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
public class UserOrgPO {
    private String id;
    private String name;
    private String orgId;

    public String getOrgId() {
        return "ORG" + orgId;
    }
}

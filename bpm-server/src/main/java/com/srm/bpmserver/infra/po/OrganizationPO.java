

package com.srm.bpmserver.infra.po;

import java.io.Serializable;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
public class OrganizationPO implements Serializable {
    private static final long serialVersionUID = -3146284554025094283L;
    private String id;
    private String pid;
    private String name;

    public String getId() {
        return "ORG" + this.id;
    }

    public String getPid() {
        return "ORG" + this.pid;
    }
}

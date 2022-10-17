

package com.srm.bpm.logic.dto;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
public class UserInfoDTO implements Serializable {

    private static final long serialVersionUID = 8635909872276543514L;
    private String id;
    private String code;
    private String avatar;
    private String nickname;
    private String name;
    private String phone;
    private Integer gender;
    private String address;
    private LocalDateTime activationTime;
    private String area;
    private Integer status;
    private String email;
    private List<UserOrgDTO> orgs;
    private List<UserPositionDTO> positions;
}

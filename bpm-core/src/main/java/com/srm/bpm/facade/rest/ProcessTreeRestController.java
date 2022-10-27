

package com.srm.bpm.facade.rest;

import com.google.common.base.Strings;

import com.srm.bpm.logic.dto.ZTreeDTO;
import com.srm.bpm.logic.service.UserCenterlogic;
import com.srm.common.data.rest.R;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import lombok.RequiredArgsConstructor;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/process/tree/rest")
public class ProcessTreeRestController {
    private final UserCenterlogic  userCenterlogic;

    @GetMapping("/organization")
    public R organization(String q) {
        final List<ZTreeDTO> organization = userCenterlogic.organization("",Strings.isNullOrEmpty(q) ? "" : q, null);
        return R.ok(organization);
    }

    @GetMapping("/organization/user")
    public R organizationUser(String q,
                              @RequestParam(value = "onlyChoiceUser", required = false) boolean onlyChoiceUser,
                              @RequestParam(value = "state", required = false) String state) {
        return R.ok(userCenterlogic.organizationUser("",q, onlyChoiceUser, state));
    }


    @GetMapping("/position/user")
    public R positionUser() {
        return R.ok(userCenterlogic.positionUser(""));
    }

    @GetMapping("/position")
    public R position(String q) {
        return R.ok(userCenterlogic.position("",Strings.isNullOrEmpty(q) ? "" : q));
    }
}

 

package com.srm.bpm.facade.page;

import com.google.common.base.Strings;

import com.srm.bpm.logic.service.UserCenterlogic;
import com.srm.config.BpmConfig;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Objects;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Controller
@RequestMapping("/process/bill/page")
@RequiredArgsConstructor
@Slf4j
public class ProcessBillPageController {
    private final UserCenterlogic userFeignClient;
    private final BpmConfig bpmConfig;

    @GetMapping("/create")
    public String createBill(Long processId,
                             String key,
                             String mode,
                             HttpServletRequest request,
                             Model model,
                             Long billId, HttpServletResponse response) {
        boolean hasToken = isHasToken(request);
        if (!hasToken) {
            final String tokenByKey = userFeignClient.getTokenByKey(key);
            if (Strings.isNullOrEmpty(tokenByKey)) {
                return "404";
            }
            Cookie cookie = new Cookie("token", tokenByKey.replace("bearer ", ""));
            cookie.setPath("/");
            cookie.setHttpOnly(false);
            cookie.setMaxAge(-1);
            response.addCookie(cookie);
            model.addAttribute("targetUrl",bpmConfig.getTargetUrl());
        }
        return "bill/create";
    }

    public static boolean isHasToken(HttpServletRequest request) {
        final Cookie[] cookies = request.getCookies();
        boolean hasToken = false;
        if (!Objects.isNull(cookies)) {
            for (Cookie cookie : cookies) {
                final String name = cookie.getName();
                if (name.equals("token")) {
                    hasToken = true;
                }
            }
        }
        return false;
    }
}

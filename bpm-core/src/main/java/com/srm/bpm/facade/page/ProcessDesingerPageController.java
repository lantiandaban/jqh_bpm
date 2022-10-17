

package com.srm.bpm.facade.page;

import com.google.common.base.Strings;
import com.google.common.collect.Maps;

import com.srm.bpm.logic.constant.BpmnConst;
import com.srm.bpm.logic.dto.FormDesingerDTO;
import com.srm.bpm.logic.dto.ProcessDesingerDTO;
import com.srm.bpm.logic.dto.ProcessDetailDTO;
import com.srm.bpm.logic.service.DataSourceLogic;
import com.srm.bpm.logic.service.ProcessDesingerLogic;
import com.srm.bpm.logic.service.UserCenterlogic;
import com.srm.bpm.logic.vo.DatasourceVO;
import com.srm.config.BpmConfig;
import com.srm.common.util.serialize.JsonMapper;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;

/**
 * <p> 流程设计器 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Controller
@RequestMapping("/process/flow")
@RequiredArgsConstructor
public class ProcessDesingerPageController {
    private final UserCenterlogic userFeignClient;
    private static final String PROTYPE_JSON = "protype_json";
    private final ProcessDesingerLogic processLogic;
    private final DataSourceLogic dataSourceLogic;
    private final BpmConfig bpmConfig;
    /**
     * 流程设计器
     *
     * @param processId 流程ID
     * @param model     视图参数
     * @return 设计界面
     */
    @GetMapping("designer")
    public String index(
            @RequestParam(value = "id", defaultValue = "0") long processId,
            String key,
            HttpServletResponse response,
            HttpServletRequest request,
            Model model
    ) {
        boolean hasToken = ProcessBillPageController.isHasToken(request);
        if (!hasToken) {
            final String tokenByKey = userFeignClient.getTokenByKey(key);
            if (Strings.isNullOrEmpty(tokenByKey)) {
                return "404";
            }
            Cookie cookie = new Cookie("token", tokenByKey.replace("bearer ",""));
            cookie.setPath("/");
            cookie.setHttpOnly(false);
            cookie.setMaxAge(-1);
            response.addCookie(cookie);
            model.addAttribute("type",bpmConfig.getType());
            model.addAttribute("targetUrl",bpmConfig.getTargetUrl());
        }
        if (processId < 0) {
            model.addAttribute("error", "流程id为空");

        } else {
            ProcessDetailDTO process = processLogic.getByProecessId(processId);
            if (process == null) {
                model.addAttribute("error", "无法找到流程");
            } else {
                model.addAttribute("process", process);

                final FormDesingerDTO formDesinger = processLogic.getDesingerJSON(processId);

                final List<DatasourceVO> datasourceVOList = dataSourceLogic.getAllWithForm();

                String formJSON = "";
                if (formDesinger != null) {
                    final String desingerJson = formDesinger.getDesingerJson();
                    if (!Strings.isNullOrEmpty(desingerJson)) {
                        formJSON = desingerJson;
                    }
                }
                if (Strings.isNullOrEmpty(formJSON)) {
                    Map<String, String> vars = Maps.newHashMapWithExpectedSize(1);
                    vars.put("name", process.getName());
                    formJSON = StrUtil.format(BpmnConst.FORMJSON, vars);
                }

                final ProcessDesingerDTO desinger = processLogic.getDesingerById(processId);
                final String workflow;
                if (desinger == null) {
                    Map<String, Object> vars = Maps.newHashMapWithExpectedSize(1);
                    vars.put("id", process.getId());
                    vars.put("name", process.getName());
                    vars.put("enable", process.getCloseFlag());
                    workflow = StrUtil.format(BpmnConst.WORKFLOWJSON, vars);
                } else {
                    workflow = desinger.getDesingerJson();
                }
                model.addAttribute("formJSON", formJSON);
                model.addAttribute("datasources", JsonMapper.toJson(datasourceVOList));
                model.addAttribute("positsions", "[]");
                model.addAttribute("icons", "[]");
                model.addAttribute("workflow", workflow);
            }
        }


        return "process/designer";
    }


    @GetMapping("line")
    public String line(Model model) {
        String jsonProjectTypes = getProjectCategorys();
        model.addAttribute(PROTYPE_JSON, jsonProjectTypes);
        return "process/line";
    }

    @GetMapping("cc")
    public String cc(Model model) {

        String jsonProjectTypes = getProjectCategorys();
        model.addAttribute(PROTYPE_JSON, jsonProjectTypes);
        return "process/cc";
    }

    @GetMapping("approver")
    public String approver(Model model) {
        String jsonProjectTypes = getProjectCategorys();
        model.addAttribute(PROTYPE_JSON, jsonProjectTypes);
        return "process/approver";
    }

    private String getProjectCategorys() {
        String jsonProjectTypes = "[]";
        return jsonProjectTypes;
    }
}

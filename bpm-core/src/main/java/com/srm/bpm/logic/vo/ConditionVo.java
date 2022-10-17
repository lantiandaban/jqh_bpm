

package com.srm.bpm.logic.vo;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import com.srm.bpm.logic.util.TextUtil;
import com.srm.bpm.logic.aviator.ImplicationFunction;
import com.srm.bpm.logic.constant.BpmnConst;
import com.srm.bpm.logic.constant.LineConditionConst;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.util.Pair;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.StrUtil;
import lombok.Data;


/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class ConditionVo implements Serializable {

    private static final long serialVersionUID = -2319373705159780765L;
    /**
     * 职位信息
     */
    private List<TreeDataVO> positions;

    /**
     * 运算关系 = 标识等于 != 表示不等于； >= 表示大于等于; <= 标识小于等于 > 表示大于; < 表示小于
     */
    private String relation;

    /**
     * 表单字段信息
     */
    private ConditionFieldVO field;

    /**
     * 表单字段运算类型
     * <p>
     * 1-表单字段类型 2-申请人职位类型 3-申请人部门类型; 4-申请人类型
     */
    private int type;

    /**
     * 运算比较值
     */
    private String value;

    /**
     * 用户信息
     */
    private List<TreeDataVO> users;
    /**
     * 部门信息
     */
    private List<TreeDataVO> organizations;
    /**
     * 项目类型
     */
    private List<Select2VO> projectTypes;
    /**
     * 项目角色关系
     */
    private List<Select2VO> projectRoles;
    /**
     * 申请人项目关系
     */
    private Select2VO userProject;


    /**
     * 解析条件生成参数和 表达式
     *
     * @param index 参数索引
     * @return 表达式和 表达式参数
     */
    public Pair<String, Map<String, Object>> toExpress(int index, int conditionIndex) {
        String relation = this.getRelation();
        if (StringUtils.equals(relation, "exclude")) {
            relation = StrUtil.format("!{}", ImplicationFunction.NAME);
        } else if (StringUtils.equals(relation, "include")) {
            relation = ImplicationFunction.NAME;
        }
        switch (type) {
            case 1: {
                final ConditionFieldVO field = this.getField();
                if (field == null) {
                    return null;
                }
                final String widgetName = field.getWidgetName();
                final String value = this.getValue();
                // 判断是否为数字
                String format;
                if (StringUtils.isNumeric(value) || TextUtil.isDouble(value)) {
                    format = "var_formData.{}{}{}";
                } else {
                    format = "var_formData.{}{}'{}'";
                }
                if (relation.contains(ImplicationFunction.NAME)) {
                    final String express = StrUtil.format("{}(fd_{}_{},var_formData.{})", relation, index, conditionIndex, widgetName);
                    Map<String, Object> expressParams = Maps.newHashMap();
                    expressParams.put("fd_" + index + "_" + conditionIndex, value.split(","));
                    return Pair.of(express, expressParams);
                } else {
                    final String express = StrUtil.format(format, widgetName, relation, value);
                    Map<String, Object> expressParams = Collections.emptyMap();
                    return Pair.of(express, expressParams);
                }

            }
            case 2: {
                final List<TreeDataVO> positions = this.getPositions();
                if (CollectionUtil.isEmpty(positions)) {
                    return null;
                }
                final String express = StrUtil.format("{}(positions_{}_{},{})",
                        relation, index, conditionIndex, LineConditionConst.VAR_AE_POSITION);
                List<String> paramsValues = Lists.newArrayList();
                for (TreeDataVO position : positions) {
                    paramsValues.add(String.valueOf(position.getId()));
                }

                Map<String, Object> expressParams = Maps.newHashMap();
                expressParams.put("positions_" + index + "_" + conditionIndex, paramsValues);

                return Pair.of(express, expressParams);
            }
            case 3: {
                final List<TreeDataVO> organizations = this.getOrganizations();
                if (CollectionUtil.isEmpty(organizations)) {
                    return null;
                }
                final String express = StrUtil.format("{}(organizations_{}_{},{})",
                        relation, index, conditionIndex, LineConditionConst.VAR_AE_ORGANIZATION);
                List<String> paramsValues = Lists.newArrayList();
                for (TreeDataVO organization : organizations) {
                    paramsValues.add(String.valueOf(organization.getId()));
                }

                Map<String, Object> expressParams = Maps.newHashMap();
                expressParams.put("organizations_" + index + "_" + conditionIndex, paramsValues);

                return Pair.of(express, expressParams);
            }
            case 4: {
                if (CollectionUtil.isEmpty(users)) {
                    return null;
                }
                final String express = StrUtil.format("{}(users_{}_{},{})",
                        relation, index, conditionIndex, BpmnConst.VAR_APPLY_EMPLOYEE);
                List<String> paramsValues = Lists.newArrayList();
                for (TreeDataVO user : users) {
                    paramsValues.add(String.valueOf(user.getId()));
                }

                Map<String, Object> expressParams = Maps.newHashMap();
                expressParams.put("users_" + index + "_" + conditionIndex, paramsValues);

                return Pair.of(express, expressParams);
            }
            case 5: {
                if (CollectionUtil.isEmpty(projectTypes)) {
                    return null;
                }
                String varPrjectTypeKey = StrUtil.format("pt_{}_{}", index, conditionIndex);
                final String express = StrUtil.format("{}({},{})",
                        relation, varPrjectTypeKey, BpmnConst.VAR_PORJCET_TYPE);
                List<String> paramsValues = Lists.newArrayList();
                for (Select2VO select2VO : projectTypes) {
                    paramsValues.add(String.valueOf(select2VO.getId()));
                }

                Map<String, Object> expressParams = Maps.newHashMap();
                expressParams.put(varPrjectTypeKey, paramsValues);

                return Pair.of(express, expressParams);
            }
            case 6: {
                if (userProject == null) {
                    return null;
                }
                String userProjectKey = StrUtil.format("up_{}_{}", index, conditionIndex);
                final String express = StrUtil.format("{}{}{}", BpmnConst.VAR_USER_PROJECT_ROLE, relation, userProjectKey);

                Map<String, Object> expressParam = Maps.newHashMap();
                expressParam.put(userProjectKey, userProject.getId());
                return Pair.of(express, expressParam);
            }
//            case 7: {
//                if (projectTypes == null || projectRoles == null) {
//                    return null;
//                }
//                String varPrjectTypeKey = StrUtil.format("pt_{}_{}", index, conditionIndex);
//                String varPrjectRoleKey = StrUtil.format("pr_{}_{}", index, conditionIndex);
//                final String express;
//                final String projectRoleCheck = "{}({},'{}',{},{})";
//                express = StrUtil.format(projectRoleCheck, ProjectRoleFunction.NAME, VAR_APPLY_EMPLOYEE, relation, varPrjectTypeKey, varPrjectRoleKey);
//                Map<String, Object> expressParams = Maps.newHashMap();
//
//                List<String> projectTypeMap = Lists.newArrayList();
//                for (Select2VO select2VO : projectTypes) {
//                    projectTypeMap.add(String.valueOf(select2VO.getId()));
//                }
//                expressParams.put(varPrjectTypeKey, projectTypeMap);
//                List<String> _projectRoles = Lists.newArrayList();
//                for (Select2VO roleSelect : projectRoles) {
//                    _projectRoles.add(String.valueOf(roleSelect.getId()));
//                }
//                expressParams.put(varPrjectRoleKey, _projectRoles);
//                return Pair.of(express, expressParams);
//            }
            case 8: {
                // 表单项目
                if (projectRoles == null) {
                    return null;
                }
                String varPrjectRoleKey = StrUtil.format("pr_{}_{}", index, conditionIndex);
                final String express;
                final String templateFormProject = "{}({},'{}',{})";
                express = StrUtil.format(templateFormProject, ImplicationFunction.NAME, BpmnConst.VAR_PROJECT, relation, varPrjectRoleKey);
                Map<String, Object> expressParams = Maps.newHashMap();
                List<String> _projectRoles = Lists.newArrayList();
                for (Select2VO roleSelect : projectRoles) {
                    _projectRoles.add(String.valueOf(roleSelect.getId()));
                }
                /*
                *  var ProjectRoles = [
            {id: 1, text: '项目经理'},
            {id: 2, text: '项目总监'},
            {id: 3, text: '项目售前负责人'}
        ];
                * */
                expressParams.put(varPrjectRoleKey, _projectRoles);
                return Pair.of(express, expressParams);
            }
            default:
                return null;

        }
    }

}

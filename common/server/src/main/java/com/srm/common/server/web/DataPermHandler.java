

package com.srm.common.server.web;

import com.google.common.base.Strings;
import com.google.common.collect.Lists;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.lang.Pair;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;
import com.srm.common.base.status.DatapermCondition;
import com.srm.common.server.model.SysPermissionDataRuleModel;
import com.srm.common.util.serialize.JsonMapper;

import static com.srm.common.data.constant.UserAuthConstant.DATA_PERMS;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Slf4j
public class DataPermHandler {
    private DataPermHandler() {
    }

    /**
     * 从request的header中取本次请求的数据规则
     *
     * @return 数据规则集合
     */
    public static List<SysPermissionDataRuleModel> currentDataPerms() {
        //从Header中数据规则
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = servletRequestAttributes.getRequest();
        String userJson = request.getHeader(DATA_PERMS);
        if (StrUtil.isEmpty(userJson)) {
            return Collections.emptyList();
        }
        return JsonMapper.listOfJson(userJson, SysPermissionDataRuleModel.class);
    }

    public static String initDatapermsSql() {
        final List<SysPermissionDataRuleModel> sysPermissionDataRuleModels = DataPermHandler.currentDataPerms();
        String resultSql = "";
        for (SysPermissionDataRuleModel sysPermissionDataRuleModel : sysPermissionDataRuleModels) {
            final Pair<String, Object[]> sqlAndVal = generateSql(sysPermissionDataRuleModel);
            final String sql = sqlAndVal.getKey();
            final Object[] value = sqlAndVal.getValue();
            if (!Strings.isNullOrEmpty(sql)) {
                log.info("处理的sql:{}", sql);
                if (!Objects.isNull(value)) {
                } else {
                }
            }
        }
        return resultSql;
    }

    /**
     * 初始化查询条件，会自动拼接数据权限的sql
     *
     * @param <T> entity类型
     * @return Lambda查询条件
     */
    public static <T> LambdaQueryWrapper<T> initDataPerms() {
        LambdaQueryWrapper<T> lambdaQueryWrapper = new LambdaQueryWrapper<>();
        final List<SysPermissionDataRuleModel> sysPermissionDataRuleModels = DataPermHandler.currentDataPerms();
        boolean first = true;
        for (SysPermissionDataRuleModel sysPermissionDataRuleModel : sysPermissionDataRuleModels) {
            final Pair<String, Object[]> sqlAndVal = generateSql(sysPermissionDataRuleModel);
            final String sql = sqlAndVal.getKey();
            final Object[] value = sqlAndVal.getValue();
            if (!Strings.isNullOrEmpty(sql)) {
                if (!Objects.isNull(value)) {
                    if (!first) {
                        lambdaQueryWrapper.or().apply(sql, value);
                    } else {
                        lambdaQueryWrapper.apply(sql, value);
                    }
                } else {
                    if (!first) {
                        lambdaQueryWrapper.or().apply(sql);
                    } else {
                        lambdaQueryWrapper.apply(sql);
                    }
                }
            }
            first = false;
        }
        return lambdaQueryWrapper;
    }

    /**
     * 组装sql，目前sql组装简单的sql
     *
     * @param sysPermissionDataRuleModel 数据规则对象
     * @return 组装的sql和参数
     */
    public static Pair<String, Object[]> generateSql(SysPermissionDataRuleModel sysPermissionDataRuleModel) {
        final Integer ruleConditions = sysPermissionDataRuleModel.getRuleConditions();
        final DatapermCondition datapermCondition = DatapermCondition.forValue(ruleConditions);
        final String ruleColumn = sysPermissionDataRuleModel.getRuleColumn();
        final String ruleValue = sysPermissionDataRuleModel.getRuleValue();
        String sql = "";
        Object[] o = null;
        switch (datapermCondition) {
            case ALL:
                break;
            case SELF:
                sql = ruleColumn + " = {0}";
                o = new Object[1];
                o[0] = LoginUserHolder.getUserCode();
                break;
            case ALL_ORG:
                return generateOrgSql(ruleColumn, LoginUserHolder.getUserOrgs());
            case ALL_ORG_SUB:
                return generateOrgSql(ruleColumn, LoginUserHolder.getSubOrgs());
            case CUSTOM:
                sql = ruleColumn + " " + ruleValue;
                break;
            default:
                break;
        }
        return new Pair<>(sql, o);
    }

    /**
     * 组装组织查询的SQL
     *
     * @param ruleColumn 字段名称
     * @param userOrgs   组织的编码集合
     * @return 组装的sql和参数
     */
    public static Pair<String, Object[]> generateOrgSql(String ruleColumn, Set<String> userOrgs) {
        String sql = "";
        Object[] o;
        if (CollectionUtil.isEmpty(userOrgs)) {
            sql = "1!=1";
            o = null;
        } else {
            List<String> str = Lists.newArrayListWithCapacity(userOrgs.size());
            int i = 0;
            for (String userOrg : userOrgs) {
                str.add("{" + i + "}");
                i++;
            }
            sql = ruleColumn + " IN (" + StrUtil.join(",", str) + ")";
            o = userOrgs.toArray();
        }
        return new Pair<>(sql, o);
    }
}

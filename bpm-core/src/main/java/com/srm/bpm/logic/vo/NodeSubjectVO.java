

package com.srm.bpm.logic.vo;

import com.google.common.collect.Sets;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import cn.hutool.core.collection.CollectionUtil;
import lombok.Data;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class NodeSubjectVO implements Serializable {
    private static final long serialVersionUID = -6497957517579939108L;


    /**
     * 审批人  审批人类型 1-组织机构;2-项目字段;3-客户字段,5-表单中的某个字段是审批人;
     * <p>
     * 抄送人  抄送人类型 1-指定人员；2-申请人直属上级;3-审批人直属上级
     */
    private int type;

    /**
     * 只有subject.setting.type = 1 的时候 才有值
     * <p>
     * 1-指定人员;2-申请人部门; 3-指定职位；4-申请人直属上级；5-申请人上级部门
     */
    private int hrType;
    /**
     * 只有 subject.setting.hrType == 2 的时候 才会这个值 1-部门领导;2-部门职位
     */
    private int orgType;

    /**
     * 上级部门级别
     */
    private int level;


    /**
     * 只有 subject.setting.type = 2 的时候 才有值
     */
    private NodeBizVO project;
    /**
     * 只有 subject.setting.type = 3 的时候 才有值
     */
    private NodeBizVO customer;


    /**
     * 用户信息
     */
    private List<TreeDataVO> users;
    /**
     * 部门信息
     */
    private List<TreeDataVO> organizations;
    /**
     * 职位信息
     */
    private List<TreeDataVO> positions;

    private FieldVO field;


    /**
     * 取得设置中指定的员工ID
     *
     * @return 员工ID 字符串
     */
    public Set<String> assignEmployee() {
        final List<TreeDataVO> users = this.getUsers();
        if (CollectionUtil.isNotEmpty(users)) {
            Set<String> employees = Sets.newHashSetWithExpectedSize(users.size());
            for (TreeDataVO user : users) {
                employees.add(String.valueOf(user.getId()));
            }
            return employees;
        }
        return Collections.emptySet();
    }
}

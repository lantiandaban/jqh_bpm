

package com.srm.bpm.logic.query;

import com.baomidou.mybatisplus.core.enums.SqlLike;
import com.baomidou.mybatisplus.core.toolkit.sql.SqlUtils;

import lombok.Data;

/**
 * 员工选择查询类
 */
@Data
public class UserChooseQuery {
    /**
     * 员工姓名
     */
    private String username;
    /**
     * 员工所属部门
     */
    private Long orgId;

    /**
     * 员工职位
     */
    private String positionId;


    public String getUsernameLike() {
        return SqlUtils.concatLike(this.username, SqlLike.DEFAULT);
    }


}

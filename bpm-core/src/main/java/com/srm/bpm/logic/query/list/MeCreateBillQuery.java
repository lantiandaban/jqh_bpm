

package com.srm.bpm.logic.query.list;

import com.google.common.base.Strings;

import java.time.LocalDate;

import lombok.Data;
import lombok.EqualsAndHashCode;
import com.srm.common.util.datetime.DateTimeUtil;

/**
 * <p> 审批单 我发起的查询条件</p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class MeCreateBillQuery extends DraftBillQuery {
    private static final long serialVersionUID = 5387143641375409300L;

    /**
     * 开始时间 -- 结束时间
     */
    private String rangeTime;

    /**
     * 审批类型
     */
    private long processId;

    /**
     * 审批状态
     */
    private Integer status;

    /**
     * 审批人ID
     */
    private long approval;

    /**
     * 提交人ID
     */
    private long sender;


    public LocalDate getStartTime() {
        if (Strings.isNullOrEmpty(rangeTime)) {
            return LocalDate.now().plusMonths(-5);
        } else {
            final String[] timeSplit = rangeTime.split(" - ");
            return DateTimeUtil.str2Date(timeSplit[0]);
        }
    }

    @Override
    public long getUnixStartTime() {
        return DateTimeUtil.unixTime(getStartTime());
    }

    public LocalDate getEndTime() {
        if (Strings.isNullOrEmpty(rangeTime)) {
            return LocalDate.now();
        } else {
            final String[] timeSplit = rangeTime.split(" - ");
            return DateTimeUtil.str2Date(timeSplit[1]);
        }

    }

    @Override
    public long getUnixEndTime() {
        return DateTimeUtil.unixTime(getEndTime()) + 86399;
    }
}

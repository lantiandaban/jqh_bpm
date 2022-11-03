

package com.srm.bpm.logic.query.list;


import com.google.common.base.Strings;

import com.baomidou.mybatisplus.core.enums.SqlLike;
import com.baomidou.mybatisplus.core.toolkit.sql.SqlUtils;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;

import lombok.Data;
import com.srm.bpm.logic.constant.StringPool;
import com.srm.common.util.datetime.DateTimeUtil;

/**
 * <p>草稿列表的查询条件 </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@SuppressWarnings("unused")
@Data
public class DraftBillQuery implements Serializable {
    public static final String RANGE_TIME_DASH = " - ";
    private static final long serialVersionUID = -822556348605273588L;
    /**
     * 开始时间-结束时间
     * <p>
     * 2017-09-12 - 2017-09-29
     */
    private String rangeTime;
    /**
     * 业务流程id
     */
    private long processId;


    /**
     * 审批编号
     */
    private String code;


    /**
     * 审批标题
     */
    private String title;

    /**
     * 编号或者标题
     */
    private String text;

    private Integer status;


    public long getUnixStartTime() {

        if (Strings.isNullOrEmpty(rangeTime)) {
            return 0;
        } else {
            final String[] timeSplit = rangeTime.split(RANGE_TIME_DASH);
            String startDay = timeSplit[0];
			try {
				Date startDate = new SimpleDateFormat("yyyy-MM-dd").parse(startDay);
				return startDate.getTime()/1000;
			} catch (ParseException e) {
				e.printStackTrace();
				return 0;
			}
        }
    }

    public long getUnixEndTime() {
        if (Strings.isNullOrEmpty(rangeTime)) {
            return Long.MAX_VALUE;
        } else {
            final String[] timeSplit = rangeTime.split(RANGE_TIME_DASH);
            String endDay = timeSplit[1];
			try {
				Date endDate = new SimpleDateFormat("yyyy-MM-dd").parse(endDay);
				return endDate.getTime()/1000 + 86400;
			} catch (ParseException e) {
				e.printStackTrace();
				return Long.MAX_VALUE;
			}
        }
    }


    public String getCodeLike() {
        if (Strings.isNullOrEmpty(code)) {
            return StringPool.EMPTY;
        } else {
            return SqlUtils.concatLike(code, SqlLike.RIGHT);
        }
    }

    public String getTitleLike() {
        if (Strings.isNullOrEmpty(title)) {
            return StringPool.EMPTY;
        } else {
            return SqlUtils.concatLike(title, SqlLike.RIGHT);
        }
    }

    public String getTextLike() {
        if (Strings.isNullOrEmpty(text)) {
            return StringPool.EMPTY;
        } else {
            return SqlUtils.concatLike(text, SqlLike.DEFAULT);
        }
    }

}

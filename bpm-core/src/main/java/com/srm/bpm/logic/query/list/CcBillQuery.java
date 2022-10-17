

package com.srm.bpm.logic.query.list;


import lombok.Data;
import lombok.EqualsAndHashCode;
import com.srm.bpm.logic.constant.StringPool;

/**
 * <p> 审批单 我发起的查询条件</p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CcBillQuery extends DraftBillQuery {
    private static final long serialVersionUID = 5387143641375409300L;
    private long approval;
    private String title;


    @Override
    public String getTitleLike() {
        if (this.title == null) {
            this.title = StringPool.EMPTY;
        }
        return StringPool.PERCENT + title + StringPool
                .PERCENT;
    }
    private long sender;

}

 

package com.srm.bpm.logic.service;

import java.util.List;

import cn.hutool.core.lang.Pair;
import com.srm.bpm.logic.dto.BillReplyDTO;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface BillReplyLogic {
    Pair<List<BillReplyDTO>, Long> findByBillId(Integer page, Integer pageSize, Long billId);

    boolean deleteByBillId(long billId, long replyId);

    BillReplyDTO submit(Long billId, String content);
}



package com.srm.common.base.vo;

import com.baomidou.mybatisplus.core.metadata.IPage;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Collections;
import java.util.List;

/**
 * 描述: 分页应答对象
 *
 * @author Wang_Bing
 * @version 1.0
 * @since 05/12/2021 17:33
 */
@Setter
@Getter
@ToString
public class PagedVO<T> {
    private Long pageNo = 1L;
    private Long totalPages = 0L;
    private Long totalCounts = 0L;
    private List<T> list = Collections.EMPTY_LIST;

    public static <T> PagedVO<T> build(IPage<T> page) {
        PagedVO<T> res = new PagedVO<>();
        res.setList(page.getRecords());
        res.setPageNo(page.getCurrent());
        res.setTotalPages(page.getPages());
        res.setTotalCounts(page.getTotal());
        return res;
    }
}

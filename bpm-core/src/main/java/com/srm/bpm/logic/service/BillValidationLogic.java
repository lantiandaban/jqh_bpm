

package com.srm.bpm.logic.service;

import com.srm.bpm.logic.context.BillDataContext;
import com.srm.bpm.logic.dto.ValidationResultDTO;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface BillValidationLogic {
    /**
     * 表单验证 1.是否验证通过 2.验证的提示消息 3.关联的表单 4.是否允许继续提交
     * @param billDataValue 表单的数据
     * @return 验证的结果
     */
    ValidationResultDTO validation(BillDataContext billDataValue, String userCode);
}

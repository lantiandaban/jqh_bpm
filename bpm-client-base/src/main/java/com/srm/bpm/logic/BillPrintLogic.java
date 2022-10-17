

package com.srm.bpm.logic;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface BillPrintLogic {
    /**
     * 执行回调方法
     *
     * @param processId 审批流程id
     * @param billId    审批单id
     * @param printTemplatePath    文件打印模版
     */
    XSSFWorkbook execute(Long processId, Long billId,String printTemplatePath);

    /**
     * 流程的id，使用逗号隔开表示多个
     * @return 服务的id
     */
    String getServiceId();
}

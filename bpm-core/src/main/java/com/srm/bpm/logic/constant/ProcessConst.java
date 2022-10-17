

package com.srm.bpm.logic.constant;

import java.io.File;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
public interface ProcessConst {

    /**
     * 流程草稿状态
     */
    int PROCESS_STATUS_DRAFT = 0;
    /**
     * 流程正常使用状态
     */
    int PROCESS_STATUS_NORMAL = 1;
    /**
     * 流程修改状态
     */
    int PROCESS_STATUS_UPDATE = 2;
    /**
     * 流程禁用状态
     */
    int PROCESS_STATUS_DISABLE = 3;

    /**
     * 流程标识表达式
     */
    String PROCESS_KEY_FORMAT = "Process_{}";

    /**
     * 流程图文件路径
     *
     *
     * 1. 第1个替换符 {} 标识 流程KEY
     *
     * 2. 第2个替换符 {} 标识 流程版本
     *
     * 3. 第3个替换符 {} 标识 流程图名称
     */
    String DIAGRAM_PATH = "diagrams" + File.separator + "{}" + File.separator + "{}" +
            File.separator + "{}";


}

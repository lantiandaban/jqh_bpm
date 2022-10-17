

package com.srm.bpm.logic.constant;


import com.srm.common.util.error.ErrorCode;

/**
 * <p> </p>
 *
 * @author yxcheng
 * @version 1.0
 * @since JDK 1.7
 */

public enum ProcessCode implements ErrorCode {

    /**
     * 流程无法找到
     */
    PROCESS_NOT_FOUND(30008),
    /**
     * 流程ID 不能为空
     */
    PROCESS_ID_REQUIRED(30009),
    /**
     * 部署流程失败
     */
    DEPLOYEE_FAILURE(30019),
    /**
     * 表单数据为空
     */
    BILL_FORM_DATA_EMPTY(30020),
    /**
     *
     */
    BILL_SAVE_PROCESS_NIL(30021),
    /**
     * 流程状态错误无法使用
     */
    BILL_PROCESS_NOT_USED(30022),
    /**
     *
     */
    FLOW_PROCESS_NULL(30023),
    /**
     * 流程提交发起发生错误
     */
    FLOW_START_ERROR(30024),

    /**
     * 流程表单无明细字段
     */
    PROCESS_FORM_DETAIL_EMPTY(30025),
    /**
     * 业务说明文档保存失败
     */
    PROCESS_DOCUMENTATION_SAVE_ERROR(30026),
    /**
     * 打印模板保存失败
     */
    PROCESS_PRINT_TEMPLATE_SAVE_ERROR(30027),
    /**
     * 流程发起无法找到节点信息或者流程错误
     */
    PROCESS_ACTIVITI_ERROR(30028),
    /**
     * 报销单ID 不能为空
     */
    BILL_ID_REQUIRED(30029),
    /**
     * 查询JSON错误
     */
    QUERY_JSON_ERROR(30030),
    /**
     * 未找到数据源
     */
    DS_NOT_FOUND(30031),
    /**
     * 下拉款参数错误
     */
    COMBO_ERROR(30032),
    /**
     * 数据源主键不存在
     */
    PARAM_DS_ID_NOT_EXIST(30033),
    /**
     * 数据源编码为空
     */
    CODE_EMPTY(30034),
    /**
     * 动态sql参数不存在
     */
    PARA_SQL_SCRIPT_NOT_EXIST(30035),
    /**
     * 数据源编码已存在
     */
    DATASOURCE_CODE_IS_EXSIT(30036),
    /**
     * 数据源保存错误
     */
    DS_SAVE_ERROR(30037),
    /**
     * 数据源主键列表不存在
     */
    PARAM_DS_IDS_NOT_EXIST(30038),
    /**
     * 删除数据源错误
     */
    DELETE_DS_ERROR(30039),
    /**
     * 批量删除数据源错误
     */
    BATCH_DELETE_DS_ERROR(30040),
    /**
     * 流程类型名称已存在
     */
    PROCESS_TYPE_ALREADY_EXIST(30041),
    /**
     * 流程类型编码已存在
     */
    PROCESS_TYPE_CODE_ALREADY_EXIST(30042),
    /**
     * 动态sql执行失败
     */
    SQL_SCRIPT_EXCUTE_ERROR(30043),
    /**
     * 审批标题没有设置
     */
    PROCESS_TITLE_SET(30044);


    private final int code;

    ProcessCode(int code) {
        this.code = code;
    }

    @Override
    public int getCode() {
        return this.code;
    }
}

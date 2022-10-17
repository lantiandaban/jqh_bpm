

package com.srm.bpm.logic.error;


import com.srm.common.util.error.ErrorCode;

/**
 * <p>审批单错误码.</p>
 *
 * @author yxcheng
 * @version 1.0
 * @since JDK 1.7
 */

public enum BillCode implements ErrorCode {

    /**
     * 审批单不在草稿箱中
     */
    BILL_NOT_IN_DRAFTS(60002),
    /**
     * 当前审批单不属于审批状态
     */
    APPROVAL_STATUS_ERROR(60003),
    /**
     * 审批任务无法找到
     */
    TASK_NOT_FOUND(60006),
    /**
     * 发起流程失败
     */
    START_FLOW_ERROR(60007),
    /**
     * 流程定义不存在
     */
    PROCESS_NOT_FOUND(60008),
    /**
     * 审批单不存在
     */
    BILL_NOT_FOUND(60009),
    /**
     * 未找到流程节点
     */
    PROCESS_NODE_NOT_FOUND(60011),
    /**
     * 归档节点无法拒绝
     */
    ARCHIVE_STATUS_REFUSE(60019),
    /**
     * 提交节点无法拒绝
     */
    SUMIT_STATUS_REFUSE(60020),
    /**
     * 审批表单字段配置错误
     */
    FORM_FIELD_ERROR(60022),
    /**
     * 表单字段值错误
     */
    FORM_DATA_ERROR(60023),
    /**
     * 审批单不能查看
     */
    CAN_NOT_SEE(60024),
    /**
     * 审批申请已被撤销，无法审批
     */
    BILL_CANCEL_ONAGREE(60025),
    /**
     * 审批单已经审批完成！
     */
    BILL_HAS_COMPLETE(60026),
    /**
     * 审批单正在审批中
     */
    Bill_APPROVAL_IN(60027),
    /**
     * 审批任务已经审批完成
     */
    BILL_TASK_HAS_APPROVED(60028),
    /**
     * 审批任务不在审批中
     */
    BILL_TASK_NOT_APPROVAL(60029),
    /**
     * 流程分类编码已经存在
     */
    PROCESS_CATEGORY_CODE_EXIST(60031),
    /**
     * 流程分类名称已经存在
     */
    PROCESS_CATEGORY_NAME_EXIST(60032),
    /**
     * 表单数据保存失败
     */
    FROM_DESIGN_SAVE_ERROR(60033),
    /**
     * 流程设计信息保存错误
     */
    PROCESS_DESIGN_SAVE_ERROR(60034),
    /**
     * 审批单信息保存错误
     */
    BILL_DATA_SAVE_ERROR(60035),
    /**
     * 保存表单明细配置失败
     */
    BILL_DETAILL_SAVE_ERROR(60036),
    /**
     * 60037=表单设计字段保存失败
     */
    FROM_DESIGN_FILED_SAVE_ERROR(60037),
    /**
     * 60038=流程设计格式错误
     */
    PROCESS_DESIGN_FORMAT_ERROR(60038),
    /**
     * 60039=流程发布发生错误
     */
    PROCESS_PUBLISHING_ERROR(60039),
    /**
     * 60040=数据源编码已存在
     */
    DATASOURCE_CODE_EXIST(60040),
    /**
     * 60041=数据源字段保存错误
     */
    DATASOURCE_FIELD_SAVE_ERROR(60041),
    /**
     * 60042=数据源条件保存错误
     */
    DATASOURCE_CONDITION_SAVE_ERROR(60042),
    /**
     * 60043=数据源下拉框保存错误
     */
    DATASOURCE_SELECT_SAVE_ERROR(60043),
    /**
     * 60044=数据源弹出框保存错误
     */
    DATASOURCE_EJECT_SAVE_ERROR(60044),
    /**
     * 60045=删除字段信息失败
     */
    DATASOURCE_FILED_DEL_ERROR(60045),
    /**
     * 60046=删除条件信息失败
     */
    DATASOURCE_CONDITION_DEL_ERROR(60046),
    /**
     * 60047=删除下拉框信息失败
     */
    DATASOURCE_SELECT_DEL_ERROR(60047),
    /**
     * 60048=删除弹出框失败
     */
    DATASOURCE_EJECT_DEL_ERROR(60048),
    /**
     * 60049=加签处理人不能是自己
     */
    ENDORSE_CANNOT_SELF(60049),
    /**
     * 60050=加签处理人已经是节点审批人
     */
    ENDORSE_CANNOT_IN_NODE(60050),

    /**
     * 60051=找不到审批人
     */
    NO_APPROVER(60051),
    /**
     * 60052=移交处理人已经是节点审批人
     */
    TURN_CANNOT_IN_NODE(60052),
    /**
     * 退回-当前节点不存在
     */
    CURRENT_TASK_NULL(60053),
    /**
     * 退回-目标节点不存在
     */
    TARGET_TASK_NULL(60054),
    ;

    private final int code;

    /**
     * 错误码
     *
     * @param code code
     */
    BillCode(final int code) {
        this.code = code;
    }

    @Override
    public int getCode() {
        return this.code;
    }
}

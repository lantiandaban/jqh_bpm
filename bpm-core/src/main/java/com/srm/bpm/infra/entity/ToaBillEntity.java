 

package com.srm.bpm.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 审批单数据
 * </p>
 *
 * @author JT
 * @since 2021-03-23
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("toa_bill")
public class ToaBillEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private String code;

    /**
     * 编号规则
     */
    private Long codeRule;

    private Long processId;

    private String processInstanceId;

    private String formTableName;

    private String title;

    private String content;

    /**
     * 提交人
     */
    private String sender;

    /**
     * 所属部门
     */
    private String departmentCode;

    /**
     * 审批状态;0-待提交;1-审批中；2-已同意；3-已拒绝；4-已撤销;
     */
    private Integer status;

    private String device;

    /**
     * 赞数
     */
    private Integer likes;

    /**
     * 回复数
     */
    private Integer replies;

    private String approvalItem;

    /**
     * 发起时间
     */
    private Integer startTime;

    /**
     * 完成时间
     */
    private Integer completionTime;

    /**
     * 优先级;1-紧急;2-高;3-普通;4-低;
     */
    private Integer priority;

    /**
     * 归档时间
     */
    private Integer archivedTime;

    /**
     * 附件标记
     */
    private Integer attachmentFlag;


}

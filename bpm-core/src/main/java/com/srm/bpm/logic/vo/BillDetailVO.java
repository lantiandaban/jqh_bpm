

package com.srm.bpm.logic.vo;

import com.alibaba.fastjson.annotation.JSONField;
import com.alibaba.fastjson.serializer.SerializerFeature;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;

import lombok.Builder;
import lombok.Data;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Data
@Builder
public class BillDetailVO<T> implements Serializable {
    private static final long serialVersionUID = 4870923130091745274L;

    /**
     * 表单模板信息
     */
    private T form;

    /**
     * 业务流程主键
     */
    private long processId;

    /**
     * 审批单主键
     */
    private long billId;

    /**
     * 任务主键
     */
    private String taskId;
    /**
     * 控件权限
     */
    private List<FormPermissionVO> permission;

    /**
     * 意见列表
     */
    private List<BillOpinionVO> opinions;

    /**
     * 表单数据
     */
    @JSONField(serialzeFeatures = {SerializerFeature.WriteMapNullValue, SerializerFeature.WriteNullBooleanAsFalse})
    private Map<String, Object> formData;

    /**
     * 审批单按钮
     */
    private List<String> btns;

    /**
     * 表单的标题
     */
    private String title;
    private String code;

    /**
     * 表单模式
     */
    private String mode;

    /**
     * 审批日志
     */
    private List<BillApprovalHistoryVO> track;

    /**
     * 审批表单的路径
     */
    private String approveLink;
    private BigDecimal approveFormHeight;

    private Set<String> selfTaskNames;

}

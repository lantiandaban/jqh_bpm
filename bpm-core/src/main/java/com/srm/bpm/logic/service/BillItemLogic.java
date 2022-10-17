

package com.srm.bpm.logic.service;

import com.alibaba.fastjson.JSONArray;

import org.activiti.form.model.FormField;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.lang3.tuple.Triple;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.srm.bpm.infra.entity.BillBizDataEntity;
import com.srm.bpm.infra.po.FormFieldPO;
import com.srm.bpm.logic.dto.BillItemFieldDto;
import com.srm.bpm.logic.vo.BillAssociatedVO;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface BillItemLogic {
    /**
     * 解析弹出层选择的数据
     *
     * @param formDataMap 表单数据
     * @param formFieldVO 弹出字段
     * @param newBillId   审批ID
     * @return 元组信息，第一个是审批明细字段信息，第二个为审批关联数据，第三个是关联业务数据
     */
    Pair<List<BillAssociatedVO>, List<BillBizDataEntity>> formTriggerselectValue(
            Map<String, Object> formDataMap,
            FormFieldPO formFieldVO,
            long newBillId
    );

    /**
     * 解析明细中的字段值
     *
     * @param billId           审批单ID
     * @param detailgroupDatas 明细
     * @param detailFields     明细字段信息
     * @return 返回元组信息，第一个值为明细中的审批信息，第二个值为是否有附件标记, 第三个值为关联信息数据
     */
    Triple<Boolean, List<BillAssociatedVO>, List<BillBizDataEntity>> detailFormFileds(
            long billId, JSONArray detailgroupDatas, List<FormFieldPO> detailFields
    );



    /**
     * 将表单数据转换为物理表存储
     *
     * @param userCode  员工ID
     * @param processId   业务流程ID
     * @param billId      表单ID
     * @param formDataMap 表单数据
     */
    void converPhysicalData(String userCode, long processId, long billId, Map<String, Object> formDataMap);

    /**
     * 更新审批单信息
     *
     * @param billId   表单ID
     * @param formData 更改的表单数据
     */
    void updateByFormDataByBill(long billId, String formData);

    /**
     * 解析文件控件的值
     *
     * @param formFieldVO 文件控件信息
     * @param widgetValue 参数值
     * @return 文件值
     */
    Map<String, Object> parseFileValue(FormFieldPO formFieldVO, Object widgetValue);

    Triple<String, String, Set<Object>> getTriggerValue(FormFieldPO formField, Object widgetValue);

    /**
     * 查询明细数据
     *
     * @param column    列的信息
     * @param tableName 表的名字
     * @param billid    审批单的id
     * @return 返回明细数据
     */
    List<List<BillItemFieldDto>> findDetailByColumn(Map<String, FormField> column,
                                                    String tableName, long billid);


    /**
     * 查询明细数据-增加时区
     *
     * @param column    列的信息
     * @param tableName 表的名字
     * @param billid    审批单的id
     * @return 返回明细数据
     */
    List<List<BillItemFieldDto>> findDetailByColumnZone(Map<String, FormField> column,
                                                        String tableName, long billid);


    /**
     * 查询合计的信息
     *
     * @param column    列
     * @param tableName 表名字
     * @param billId    审批单的id
     * @return 表单项结果
     */
    List<BillItemFieldDto> findItemByFiled(Map<String, FormField> column,
                                           String tableName,
                                           long billId);

    /**
     * 查询合计的信息-时区
     *
     * @param column    列
     * @param tableName 表名字
     * @param billId    审批单的id
     * @return 表单项结果
     */
    List<BillItemFieldDto> findItemByFiledZone(Map<String, FormField> column,
                                               String tableName,
                                               long billId);

    /**
     * 解析日期格式，按照表单字段的属性配置
     *
     * @param date  日期值
     * @param props 配置JSON
     * @return 转换后的格式化输出字符串
     */
    String formDatetimeValue(Date date, String props);

    /**
     * 解析表单字段的业务字段信息，并获取标题和编码信息
     *
     * @param formDataMap 表单信息
     * @param formField   字段配置
     * @return 返回元组信息，第一个 审批编码 第二个为 审批标题
     */
    Pair<String, String> formBizValue(Map<String, Object> formDataMap, FormFieldPO formField);



    /**
     * 解析文件上传等控件类型形成审批明细
     *
     * @param formDataMap 表单字段
     * @param formFieldVO 表单字段配置
     * @return 审批明细信息
     */
    Pair<String, String> formUploadValue(Map<String, Object> formDataMap, FormFieldPO formFieldVO);
}

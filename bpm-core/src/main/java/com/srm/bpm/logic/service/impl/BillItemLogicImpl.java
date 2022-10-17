

package com.srm.bpm.logic.service.impl;

import com.google.common.base.MoreObjects;
import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.srm.bpm.infra.entity.BillBizDataEntity;
import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.bpm.infra.entity.ToaFormEntity;
import com.srm.bpm.infra.po.FormFieldPO;
import com.srm.bpm.infra.service.FormFieldService;
import com.srm.bpm.infra.service.FormTableService;
import com.srm.bpm.infra.service.ToaFormService;
import com.srm.bpm.logic.constant.BizType;
import com.srm.bpm.logic.constant.BpmnConst;
import com.srm.bpm.logic.constant.Const;
import com.srm.bpm.logic.constant.FastJsonType;
import com.srm.bpm.logic.constant.FormCode;
import com.srm.bpm.logic.constant.FormConst;
import com.srm.bpm.logic.define.FormXtype;
import com.srm.bpm.logic.define.widget.ImageuploadWidget;
import com.srm.bpm.logic.define.widget.TriggerselectWidget;
import com.srm.bpm.logic.dto.BillItemFieldDto;
import com.srm.bpm.logic.error.BillCode;
import com.srm.bpm.logic.exception.FormDataException;
import com.srm.bpm.logic.service.BillDataJsonLogic;
import com.srm.bpm.logic.service.BillItemLogic;
import com.srm.bpm.logic.vo.BillAssociatedVO;
import com.srm.bpm.logic.constant.StringPool;
import com.srm.common.data.exception.RbException;
import com.srm.common.util.datetime.DateTimeUtil;

import org.activiti.form.model.FormField;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.lang3.tuple.Triple;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static org.apache.commons.lang3.StringUtils.EMPTY;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BillItemLogicImpl implements BillItemLogic {
    private final ToaFormService formService;
    private final FormFieldService formFieldService;
    private final FormTableService formTableService;
    private final BillDataJsonLogic billDataJsonLogic;

    private static final String ID_PARAM = "#{id_}";

    /**
     * 解析弹出层选择的数据
     *
     * @param formDataMap 表单数据
     * @param formFieldVO 弹出字段
     * @param newBillId   审批ID
     * @return 元组信息，第一个是审批明细字段信息，第二个为审批关联数据，第三个是关联业务数据
     */
    @Override
    public Pair<List<BillAssociatedVO>, List<BillBizDataEntity>> formTriggerselectValue(Map<String, Object> formDataMap, FormFieldPO formFieldVO, long newBillId) {
        List<BillAssociatedVO> associateds = Lists.newArrayList();
        List<BillBizDataEntity> bizdatas = Lists.newArrayList();
        final String widgetName = formFieldVO.getWidgetName();
        final Object selectWidgetObject = formDataMap.get(widgetName);

        final String dataVal;
        if (selectWidgetObject != null) {
            if (selectWidgetObject instanceof JSONArray) {
                // 表示为多选结果
                JSONArray selectValues = (JSONArray) selectWidgetObject;
                if (CollectionUtil.isNotEmpty(selectValues)) {
                    final Pair<List<BillBizDataEntity>, List<BillAssociatedVO>> associatedAndBizdData;
                    associatedAndBizdData = multiSelectValue(formFieldVO, newBillId, selectValues);
                    final List<BillBizDataEntity> bizDatas = associatedAndBizdData.getKey();
                    final List<BillAssociatedVO> associatedList = associatedAndBizdData.getRight();
                    if (CollectionUtil.isNotEmpty(bizDatas)) {
                        bizdatas.addAll(bizDatas);
                    }
                    if (CollectionUtil.isNotEmpty(associatedList)) {
                        associateds.addAll(associatedList);
                    }
                }

            } else {
                JSONObject selectValue = (JSONObject) selectWidgetObject;
                dataVal = selectValue.getString(FormConst.VALUE);
                final String record = selectValue.getString(FormConst.RECORD);

                BillAssociatedVO billAssociated = new BillAssociatedVO();
                billAssociated.setId(dataVal);
//                billAssociated.setIcon(AssociatedIcon.link);
                billAssociated.setTitle(formFieldVO.getTitle());
                billAssociated.setName(selectValue.getString(FormConst.TEXT));
                associateds.add(billAssociated);

                BillBizDataEntity bizData = new BillBizDataEntity();
                bizData.setBillId(newBillId);
                bizData.setBizType(formFieldVO.getDatasourceCode());
                bizData.setBizValue(dataVal);
                bizData.setBizRecord(record);
                bizdatas.add(bizData);
            }
        }


        return Pair.of(associateds, bizdatas);
    }

    /**
     * 多选结果处理，并处理关联信息
     *
     * @param formFieldVO  字段信息
     * @param newBillId    审批单ID
     * @param selectValues 选择的值
     * @return 关联信息和业务信息
     */
    private Pair<List<BillBizDataEntity>, List<BillAssociatedVO>> multiSelectValue(FormFieldPO formFieldVO, long newBillId, JSONArray selectValues) {
        List<BillBizDataEntity> bizdatas = Lists.newArrayList();
        List<BillAssociatedVO> associateds = Lists.newArrayList();
        for (Object selectValue : selectValues) {
            JSONObject value = (JSONObject) selectValue;
            final String checkValue = value.getString(FormConst.VALUE);
            if (Strings.isNullOrEmpty(checkValue)) {
                continue;
            }
            final Object selectRecord = value.get(FormConst.RECORD);
            if (selectRecord != null) {
                BillAssociatedVO billAssociated = new BillAssociatedVO();
                billAssociated.setId(checkValue);
//                    billAssociated.setIcon(AssociatedIcon.link);
                billAssociated.setTitle(formFieldVO.getTitle());
                billAssociated.setName(value.getString(FormConst.TEXT));
                associateds.add(billAssociated);
                BillBizDataEntity bizData = new BillBizDataEntity();
                bizData.setBillId(newBillId);
                bizData.setBizType(formFieldVO.getDatasourceCode());
                bizData.setBizValue(checkValue);
                bizData.setBizRecord(value.getString(FormConst.RECORD));
                bizdatas.add(bizData);
            }
        }
        return Pair.of(bizdatas, associateds);
    }

    /**
     * 解析明细中的字段值
     *
     * @param billId           审批单ID
     * @param detailgroupDatas 明细
     * @param detailFields     明细字段信息
     * @return 返回元组信息，第一个值为明细中的审批信息，第二个值为是否有附件标记, 第三个值为关联信息数据
     */
    @Override
    public Triple<Boolean, List<BillAssociatedVO>, List<BillBizDataEntity>> detailFormFileds(long billId, JSONArray detailgroupDatas, List<FormFieldPO> detailFields) {
        List<BillAssociatedVO> associateds = Lists.newArrayList();
        List<BillBizDataEntity> bizDatas = Lists.newArrayList();
        boolean attachment = false;
        for (Object detailgroupData : detailgroupDatas) {
            JSONObject jsonObject = (JSONObject) detailgroupData;
            for (FormFieldPO detailField : detailFields) {
                if (detailField == null) {
                    continue;
                }
                final String detailFieldType = detailField.getType();
                FormXtype detialXtype = FormXtype.valueOf(detailFieldType);
                switch (detialXtype) {
                    case triggerselect: {

                        final Pair<List<BillAssociatedVO>, List<BillBizDataEntity>> triggerPair;
                        triggerPair = formTriggerselectValue(jsonObject, detailField, billId);
                        final List<BillAssociatedVO> associatedList = triggerPair.getKey();
                        associateds.addAll(associatedList);
                        final List<BillBizDataEntity> bizDataList = triggerPair.getValue();
                        bizDatas.addAll(bizDataList);

                        break;
                    }
                    case imageupload:
                    case fileupload: {

                        final Pair<String, String> uploadValue;
                        uploadValue = formUploadValue(jsonObject, detailField);
                        if (StringUtils.isNotEmpty(uploadValue.getKey())) {
                            attachment = true;
                        }
                        break;
                    }
                    default:
                        break;
                }
            }
        }
        return Triple.of(attachment, associateds, bizDatas);
    }

    /**
     * 将表单数据转换为物理表存储
     *
     * @param userCode    用户编码
     * @param processId   业务流程ID
     * @param billId      表单ID
     * @param formDataMap 表单数据
     */
    @Override
    public void converPhysicalData(String userCode, long processId, long billId, Map<String, Object> formDataMap) {
        // 取得表单信息
        final ToaFormEntity processForm = formService.getOne(Wrappers.lambdaQuery(ToaFormEntity.class).eq(ToaFormEntity::getProcessId, processId));
        final String tableName = processForm.getTableName();
        if (Strings.isNullOrEmpty(tableName)) {
            return;
        }
        final List<FormFieldEntity> detailFromField =
                formFieldService.list(Wrappers.lambdaQuery(FormFieldEntity.class)
                        .eq(FormFieldEntity::getFormId, processForm.getId()).eq(FormFieldEntity::getType, FormXtype.detailgroup.name()));
        // 先获取是否已经存在物理数据了
        checkAndDeleted(billId, tableName, detailFromField);

        if (CollectionUtil.isNotEmpty(detailFromField)) {
            // 存在明细
            int detailOrder = 1;
            for (FormFieldEntity formField : detailFromField) {
                final String widgetName = formField.getWidgetName();
                final List detailDatas = (List) formDataMap.get(widgetName);

                for (Object detailData : detailDatas) {
                    Map<String, Object> detailDataMap = (Map<String, Object>) detailData;
                    List<String> detailWidgetNames = Lists.newArrayList();
                    List<String> paramDetailNames = Lists.newArrayList();
                    detailWidgetNames.add("id_");
                    detailWidgetNames.add("main_id_");
                    paramDetailNames.add(ID_PARAM);
                    paramDetailNames.add("#{main_id_}");
                    Map<String, Object> params;
                    params = parseToSqlAndParams(detailWidgetNames, paramDetailNames, detailDataMap);

                    params.put("id_", IdWorker.getId());
                    params.put("main_id_", billId);

                    final String detailTableName = tableName + FormConst.DETAIL_TABLENAME + detailOrder;

                    String sqlFormat = "insert into {0} ({1}) values ({2})";

                    final String columns = StringUtils.join(detailWidgetNames, StringPool.COMMA);
                    final String paramColumns = StringUtils.join(paramDetailNames, StringPool.COMMA);
                    final String sql = StrUtil.indexedFormat(sqlFormat, detailTableName, columns, paramColumns);
                    formTableService.executeUpdateSql(sql, params);
                }

                // 移除明细数据，保存主表的数据的时候不能有明细
                formDataMap.remove(widgetName);

                detailOrder++;
            }
        }
        Map<String, Object> params;
        List<String> mainWidgetName = Lists.newArrayList();
        List<String> mainParams = Lists.newArrayList();

        mainWidgetName.add("id_");
        mainWidgetName.add("user_code");
        mainWidgetName.add("create_time");
        mainParams.add(ID_PARAM);
        mainParams.add("#{user_code}");
        mainParams.add("#{create_time}");

        params = parseToSqlAndParams(mainWidgetName, mainParams, formDataMap);
        params.put("id_", billId);
        params.put("create_time", DateTimeUtil.unixTime());
        params.put("user_code", userCode);

        String sqlFormat = "insert into {0} ({1}) values ({2})";

        final String columns = StringUtils.join(mainWidgetName, StringPool.COMMA);
        final String paramColumns = StringUtils.join(mainParams, StringPool.COMMA);
        final String sql = StrUtil.indexedFormat(sqlFormat, tableName, columns, paramColumns);
        formTableService.executeUpdateSql(sql, params);
    }

    /**
     * 检查是否存在数据， 如果存在物理表，则进行删除
     *
     * @param billId          审批单ID
     * @param tableName       主表名称
     * @param detailFromField 明细字段列表
     */
    private void checkAndDeleted(long billId, String tableName, List<FormFieldEntity> detailFromField) {
        final String template = "SELECT count(1) as count from {} WHERE id_ = {} LIMIT 1";
        String existSql = StrUtil.format(template, tableName, "#{sql.id_}");
        Map<String, Object> existSqlParams = Maps.newHashMapWithExpectedSize(1);
        existSqlParams.put("id_", billId);
        final List<Map<String, Object>> countResults;
        countResults = formTableService.executeSelectSql(existSql, existSqlParams);
        if (CollectionUtil.isNotEmpty(countResults)) {
            final Map<String, Object> countResult = countResults.get(0);
            if (CollectionUtil.isNotEmpty(countResult)) {
                final String countStr = String.valueOf(countResult.get("count"));
                final int count = MoreObjects.firstNonNull(NumberUtils.createInteger(countStr), 0);
                if (count > 0) {
                    // 已经存在数据了，则进行删除处理
                    if (CollectionUtil.isNotEmpty(detailFromField)) {
                        int detailOrder = 1;
                        // 存在明细表
                        for (FormFieldEntity ignored : detailFromField) {
                            String sqlFormat = "DELETE FROM {} WHERE main_id_ = {}";
                            final String detailTableName = tableName + FormConst.DETAIL_TABLENAME + detailOrder;
                            final String deleteDtailSql;
                            deleteDtailSql = StrUtil.format(sqlFormat, detailTableName, ID_PARAM);
                            formTableService.executeUpdateSql(deleteDtailSql, existSqlParams);
                            detailOrder++;
                        }
                    }
                    // 删除主表数据
                    String sqlFormat = "DELETE FROM {} WHERE id_ = {}";
                    final String deleteMainSql = StrUtil.format(sqlFormat, tableName, ID_PARAM);
                    formTableService.executeUpdateSql(deleteMainSql, existSqlParams);
                }

            }
        }
    }

    /**
     * 解析形成sql语句中的 动态列和 动态参数
     *
     * @param widgetNames 表单的列名
     * @param paramsnames sql的参数名
     * @param dataMap     表单数据
     * @return SQL参数
     */
    private Map<String, Object> parseToSqlAndParams(List<String> widgetNames,
                                                    List<String> paramsnames,
                                                    Map<String, Object> dataMap) {
        Map<String, Object> params = Maps.newHashMap();
        for (String detailWidgetName : dataMap.keySet()) {
            if (StringUtils.equals(detailWidgetName, BpmnConst.VAR_PROJECT)) {
                continue;
            }
            if (StringUtils.equals(detailWidgetName, BpmnConst.VAR_CUSTOMER)) {
                continue;
            }
            widgetNames.add(detailWidgetName);
            paramsnames.add(StrUtil.format("#{{}}", detailWidgetName));
            final Object detailFileValue = dataMap.get(detailWidgetName);
            params.put(detailWidgetName, detailFileValue);
        }
        return params;
    }

    /**
     * 更新审批单信息
     *
     * @param billId   表单ID
     * @param formData 更改的表单数据
     */
    @Override
    public void updateByFormDataByBill(long billId, String formData) {
        ToaFormEntity form = formService.findByBillId(billId);
        if (form == null) {
            log.error("the form is not found! billid is {}", billId);
            return;
        }
        final Map<String, Object> dataMap;
        dataMap = JSON.parseObject(formData, FastJsonType.MAP_OBJECT_TR);
        billDataJsonLogic.updateByBillId(billId, dataMap);

        // 暂时不支持明细的修改
        Map<String, Object> params;
        List<String> mainParams = Lists.newArrayList();
        params = parseUpdateSqlAndParams(form.getId(), mainParams, dataMap);
        params.put("id_", billId);

        String sqlFormat = "update {0} set {1} WHERE id_={2}";

        final String tableName = form.getTableName();
        final String paramColumns = StringUtils.join(mainParams, StringPool.COMMA);
        final String sql = StrUtil.indexedFormat(sqlFormat, tableName, paramColumns, ID_PARAM);
        formTableService.executeUpdateSql(sql, params);
    }

    /**
     * 解析形成update sql语句中的 动态列和 动态参数
     *
     * @param formId      表单ID
     * @param paramsnames sql的参数名
     * @param dataMap     表单数据
     * @return SQL参数
     */
    private Map<String, Object> parseUpdateSqlAndParams(long formId, List<String> paramsnames,
                                                        Map<String, Object> dataMap) {
        final List<FormFieldPO> formFields = formFieldService.findPOByFormId(formId);
        Map<String, FormFieldPO> widgetFieldMap = Maps.newHashMap();
        for (FormFieldPO formField : formFields) {
            widgetFieldMap.put(formField.getWidgetName(), formField);
        }
        Map<String, Object> params = Maps.newHashMap();
        for (String widgetName : dataMap.keySet()) {
            final FormFieldPO formField = widgetFieldMap.get(widgetName);
            final Object widgetValue = dataMap.get(widgetName);
            final Map<String, Object> fileValueMap = parseFileValue(formField, widgetValue);
            params.putAll(fileValueMap);

            paramsnames.add(StrUtil.format("{}=#{{}}", widgetName, widgetName));
        }

        return params;
    }

    /**
     * 解析文件控件的值
     *
     * @param formField   文件控件信息
     * @param widgetValue 参数值
     * @return 文件值
     */
    @Override
    public Map<String, Object> parseFileValue(FormFieldPO formField, Object widgetValue) {
        final String fieldType = formField.getType();
        final FormXtype type = FormXtype.valueOf(fieldType);
        final String widgetName = formField.getWidgetName();
        Map<String, Object> params = Maps.newHashMap();
        switch (type) {
            case text:
            case textarea:
            case biz: {
                final String strValue;
                strValue = this.getStringValue(widgetName, widgetValue);
                params.put(widgetName, strValue);
                break;
            }
            case datetime: {
                parseFieldDatetime(params, widgetName, widgetValue);
                break;
            }
            case number: {
                final Double numberValue;
                numberValue = this.getNumberValue(widgetName, widgetValue);
                params.put(widgetName, numberValue);
                break;
            }
            case detailcalculate:
            case money: {
                BigDecimal moneyValue;
                moneyValue = this.getMoneyValue(widgetName, widgetValue);
                params.put(widgetName, moneyValue);
                break;
            }
            case radiogroup:
            case select: {
                String value = this.getSelectValue(formField, widgetValue);
                params.put(widgetName, value);
                break;
            }

            case checkboxgroup:
            case multiselect: {
                Pair<String, String> selectValue;
                selectValue = this.getMulteSelectValue(formField, widgetValue);
                params.put(widgetName, selectValue.getKey());
                params.put(widgetName + FormConst.FIELD_EXT_NAME, selectValue.getValue());
                break;
            }
            case imageupload: {
                final String uploadVal;
                uploadVal = this.getImageUploadValue(formField, widgetValue);
                params.put(widgetName, uploadVal);
                break;
            }
            case fileupload: {
                final String uploadVal;
                uploadVal = this.getImageUploadValue(formField, widgetValue);
                params.put(widgetName, uploadVal);
                break;
            }
            case triggerselect: {
                Triple<String, String, Set<Object>> triggerValue;
                triggerValue = this.getTriggerValue(formField, widgetValue);
                final String dataValue = triggerValue.getLeft();
                if (Strings.isNullOrEmpty(dataValue)) {
                    params.put(widgetName, EMPTY);
                    params.put(widgetName + FormConst.FIELD_EXT_NAME, EMPTY);
                } else {
                    params.put(widgetName, dataValue);
                    params.put(widgetName + FormConst.FIELD_EXT_NAME, triggerValue.getMiddle());
                }
                break;
            }
            default:
                break;
        }
        return params;
    }

    @Override
    public Triple<String, String, Set<Object>> getTriggerValue(FormFieldPO formField, Object widgetValue) {
        if (widgetValue == null) {
            return Triple.of(EMPTY, EMPTY, Collections.emptySet());
        } else {

            final String props = formField.getProps();
            if (Strings.isNullOrEmpty(props)) {
                return Triple.of(EMPTY, EMPTY, Collections.emptySet());
            }
            TriggerselectWidget triggerWidget = JSONObject.parseObject(props, TriggerselectWidget.class);
            if (triggerWidget.isMultiSelect()) {
                if (widgetValue instanceof JSONArray) {
                    List<String> dataValues = Lists.newArrayList();
                    List<String> dataExtValues = Lists.newArrayList();
                    JSONArray valueArray = (JSONArray) widgetValue;
                    if (CollectionUtil.isNotEmpty(valueArray)) {
                        final Set<Object> records = Sets.newHashSet();
                        for (Object value : valueArray) {
                            final JSONObject jsonObject = (JSONObject) value;
                            final String dataValue = MoreObjects.firstNonNull(jsonObject.getString(
                                    FormConst.VALUE), EMPTY);
                            final String dataExtValue = MoreObjects.firstNonNull(jsonObject.getString(
                                    FormConst.TEXT), EMPTY);
                            dataValues.add(dataValue);
                            dataExtValues.add(dataExtValue);
                            records.add(jsonObject.get(FormConst.RECORD));
                        }
                        final String extValue = JSON.toJSONString(dataExtValues);
                        return Triple.of(JSON.toJSONString(dataValues), extValue, records);
                    } else {
                        return Triple.of(EMPTY, EMPTY, Collections.emptySet());
                    }
                } else {

                    throw new FormDataException(FormCode.MULTI_REQUIRED, formField.getTitle() + "多选");
                }
            } else {
                if (widgetValue instanceof JSONObject) {
                    final JSONObject valueObject = (JSONObject) widgetValue;
                    final String dataValue = valueObject.getString(FormConst.VALUE);
                    final String dataExtValue = valueObject.getString(FormConst.TEXT);

                    final Set<Object> records = Sets.newHashSet(valueObject.get(FormConst.RECORD));
                    return Triple.of(dataValue, dataExtValue, records);
                } else {

                    throw new FormDataException(FormCode.SIGNLE_REQUIRED);
                }
            }

        }
    }

    private String getImageUploadValue(FormFieldPO formFieldVO, Object widgetValue) {
        final String dataVal;
        if (widgetValue != null) {
            final String props = formFieldVO.getProps();
            if (Strings.isNullOrEmpty(props)) {
                return EMPTY;
            }
            ImageuploadWidget imageuploadWidget = JSON.parseObject(props, ImageuploadWidget.class);
            final boolean allowMulti = imageuploadWidget.isAllowMulti();
            dataVal = uploadValue(widgetValue, allowMulti);
        } else {
            dataVal = EMPTY;
        }
        return dataVal;
    }

    private String uploadValue(Object widgetValue, boolean allowMulti) {
        String dataVal;
        if (allowMulti) {
            if (widgetValue instanceof JSONArray) {
                JSONArray uploadValues = (JSONArray) widgetValue;
                if (CollectionUtil.isEmpty(uploadValues)) {
                    dataVal = EMPTY;
                } else {
                    List<String> values = Lists.newArrayList();
                    for (Object uploadValue : uploadValues) {
                        JSONObject value = (JSONObject) uploadValue;
                        values.add(value.getString(FormConst.UPLOAD_ATTRID));
                    }
                    dataVal = JSON.toJSONString(values);
                }
            } else if (widgetValue instanceof JSONObject) {
                JSONObject uploadValue = (JSONObject) widgetValue;
                dataVal = uploadValue.getString(FormConst.UPLOAD_ATTRID);
            } else {
                log.error("the multi image upload. client upload data has error!!!!");
                throw new FormDataException(FormCode.MULTI_REQUIRED);
            }
        } else {
            if (widgetValue instanceof JSONArray) {
                log.error("the image upload is single upload but the client upload multi images!");
                throw new FormDataException(FormCode.SIGNLE_REQUIRED);
            } else {
                JSONObject uploadValue = (JSONObject) widgetValue;
                dataVal = uploadValue.getString(FormConst.UPLOAD_ATTRID);
            }
        }
        return dataVal;
    }

    private Pair<String, String> getMulteSelectValue(FormFieldPO formField, Object widgetValue) {
        if (widgetValue == null) {
            return Pair.of(EMPTY, EMPTY);
        } else {


            final String dataVal;
            final String dataValExt;
            if (widgetValue instanceof JSONArray) {
                // 表示为多选结果
                JSONArray selectValues = (JSONArray) widgetValue;
                if (CollectionUtil.isEmpty(selectValues)) {
                    dataVal = EMPTY;
                    dataValExt = EMPTY;
                } else {
                    List<String> values = Lists.newArrayList();
                    List<Object> extValues = Lists.newArrayList();
                    for (Object selectValue : selectValues) {
                        JSONObject value = (JSONObject) selectValue;
                        final String checkValue = value.getString(FormConst.VALUE);
                        if (Strings.isNullOrEmpty(checkValue)) {
                            continue;
                        }
                        values.add(checkValue);
                        final Object selectRecord = value.get(FormConst.TEXT);
                        if (selectRecord != null) {
                            extValues.add(selectRecord);
                        }
                    }
                    dataVal = JSON.toJSONString(values);
                    dataValExt = JSON.toJSONString(extValues);
                }
            } else {
                String value = String.valueOf(widgetValue);
                if (StringUtils.isBlank(value)) {
                    dataVal = EMPTY;
                    dataValExt = EMPTY;
                } else if (StringUtils.equals(Const.NULL_STR, value)) {
                    dataVal = EMPTY;
                    dataValExt = EMPTY;
                } else {
                    dataVal = value;
                    dataValExt = EMPTY;
                }
            }
            return Pair.of(dataVal, dataValExt);
        }
    }

    private String getSelectValue(FormFieldPO formField, Object widgetValue) {
        if (widgetValue == null) {
            return EMPTY;
        } else {


            final String dataVal;
            if (widgetValue instanceof JSONObject) {
                JSONObject value = (JSONObject) widgetValue;
                final String checkValue = value.getString(FormConst.VALUE);
                if (Strings.isNullOrEmpty(checkValue)) {
                    dataVal = EMPTY;
                } else if (StringUtils.equals(Const.NULL_STR, checkValue)) {
                    dataVal = EMPTY;
                } else {
                    dataVal = checkValue;
                }
            } else {
                String value = String.valueOf(widgetValue);
                if (StringUtils.isBlank(value)) {
                    dataVal = EMPTY;
                } else if (StringUtils.equals(Const.NULL_STR, value)) {
                    dataVal = EMPTY;
                } else {
                    dataVal = value;
                }
            }
            return dataVal;
        }
    }

    private BigDecimal getMoneyValue(String widgetName, Object widgetValue) {
        if (widgetValue == null) {
            return BigDecimal.ZERO;
        } else {
            String value = String.valueOf(widgetValue);
            if (StringUtils.isBlank(value)) {
                return BigDecimal.ZERO;
            } else if (StringUtils.equals(Const.NULL_STR, value)) {
                return BigDecimal.ZERO;
            } else {
                return NumberUtils.createBigDecimal(value);
            }
        }
    }

    private Double getNumberValue(String widgetName, Object widgetValue) {
        if (widgetValue == null) {
            return 0.0D;
        } else {
            String value = String.valueOf(widgetValue);
            if (StringUtils.isBlank(value)) {
                return 0.0D;
            } else if (StringUtils.equals(Const.NULL_STR, value)) {
                return 0.0D;
            } else {
                return NumberUtils.createDouble(value);
            }
        }
    }

    private String getStringValue(String widgetName, Object widgetValue) {
        if (widgetValue == null) {
            return EMPTY;
        } else {
            String value = String.valueOf(widgetValue);
            if (StringUtils.isBlank(value)) {
                return EMPTY;
            } else if (StringUtils.equals(Const.NULL_STR, value)) {
                return EMPTY;
            } else {
                return value;
            }
        }
    }

    /**
     * 解析日期格式的表单信息
     *
     * @param formDataParam 表单数据
     * @param widgetName    控件标识
     * @param widgetValue   值
     */
    private void parseFieldDatetime(Map<String, Object> formDataParam,
                                    String widgetName, Object widgetValue) {
        try {
            final Date dateValue;
            dateValue = this.getDateValue(widgetName, widgetValue);
            formDataParam.put(widgetName, dateValue);
        } catch (ParseException e) {
            log.error("parse datatime filed has error", e);
            throw new RbException("字段[" + widgetName + "] 输入的日期格式错误!", BillCode.FORM_DATA_ERROR);
        }
    }

    private Date getDateValue(String widgetName, Object widgetValue) throws ParseException {
        if (widgetValue == null) {
            return null;
        } else {
            String value = String.valueOf(widgetValue);
            if (StringUtils.isBlank(value)) {
                return null;
            } else if (StringUtils.equals(Const.NULL_STR, value)) {
                return null;
            } else {
                return DateUtils.parseDate(value, "yyyy-MM-dd", "yyyy-MM-dd HH:mm", "yyyy-MM", "yyyy");
            }
        }
    }

    /**
     * 查询明细数据
     *
     * @param column    列的信息
     * @param tableName 表的名字
     * @param billid    审批单的id
     * @return 返回明细数据
     */
    @Override
    public List<List<BillItemFieldDto>> findDetailByColumn(Map<String, FormField> column, String tableName, long billid) {
        return null;
    }

    /**
     * 查询明细数据-增加时区
     *
     * @param column    列的信息
     * @param tableName 表的名字
     * @param billid    审批单的id
     * @return 返回明细数据
     */
    @Override
    public List<List<BillItemFieldDto>> findDetailByColumnZone(Map<String, FormField> column, String tableName, long billid) {
        return null;
    }

    /**
     * 查询合计的信息
     *
     * @param column    列
     * @param tableName 表名字
     * @param billId    审批单的id
     * @return 表单项结果
     */
    @Override
    public List<BillItemFieldDto> findItemByFiled(Map<String, FormField> column, String tableName, long billId) {
        return null;
    }

    /**
     * 查询合计的信息-时区
     *
     * @param column    列
     * @param tableName 表名字
     * @param billId    审批单的id
     * @return 表单项结果
     */
    @Override
    public List<BillItemFieldDto> findItemByFiledZone(Map<String, FormField> column, String tableName, long billId) {
        return null;
    }

    /**
     * 解析日期格式，按照表单字段的属性配置
     *
     * @param date  日期值
     * @param props 配置JSON
     * @return 转换后的格式化输出字符串
     */
    @Override
    public String formDatetimeValue(Date date, String props) {
        return null;
    }

    /**
     * 解析表单字段的业务字段信息，并获取标题和编码信息
     *
     * @param formDataMap 表单信息
     * @param formField   字段配置
     * @return 返回元组信息，第一个 审批编码 第二个为 审批标题
     */
    @Override
    public Pair<String, String> formBizValue(Map<String, Object> formDataMap, FormFieldPO formField) {
        String code = EMPTY;
        String title = EMPTY;
        final String bizType = formField.getBizType();
        if (!Strings.isNullOrEmpty(bizType)) {
            String bizValue = (String) formDataMap.get(formField.getWidgetName());
            if (StringUtils.equals(bizType, BizType.billCode.name())) {
                code = bizValue;
                if (Strings.isNullOrEmpty(code)) {
                    code = DateTimeUtil.format(LocalDateTime.now(), "yyyyMMddHHmm") + RandomUtil.randomNumbers(6);
                }
            } else if (StringUtils.equals(bizType, BizType.billTitle.name())) {
                title = bizValue;
                if (Strings.isNullOrEmpty(title)) {
                    title = DateTimeUtil.format(LocalDateTime.now(), "yyyyMMddHHmm") + RandomUtil.randomNumbers(6);
                }
            }

        }
        return Pair.of(code, title);
    }

    /**
     * 解析文件上传等控件类型形成审批明细
     *
     * @param formDataMap 表单字段
     * @param formFieldVO 表单字段配置
     * @return 审批明细信息
     */
    @Override
    public Pair<String, String> formUploadValue(Map<String, Object> formDataMap, FormFieldPO formFieldVO) {
        final String widgetName = formFieldVO.getWidgetName();

        final Object uploadValue = formDataMap.get(widgetName);

        final String dataVal;
        final String extValue;
        if (uploadValue != null) {
            if (uploadValue instanceof JSONArray) {
                JSONArray uploadValues = (JSONArray) uploadValue;
                if (CollectionUtil.isEmpty(uploadValues)) {
                    dataVal = formFieldVO.defaultValue();
                    extValue = StrUtil.EMPTY_JSON;
                } else {
                    List<String> values = Lists.newArrayList();
                    List<Object> extValues = Lists.newArrayList();
                    for (Object itemUploadVal : uploadValues) {
                        JSONObject value = (JSONObject) itemUploadVal;
                        values.add(value.getString(FormConst.UPLOAD_ATTRID));
                        extValues.add(value);
                    }
                    dataVal = JSON.toJSONString(values);
                    extValue = JSON.toJSONString(extValues);
                }
            } else {
                JSONObject itemUploadVal = (JSONObject) uploadValue;
                dataVal = itemUploadVal.getString(FormConst.UPLOAD_ATTRID);
                extValue = JSON.toJSONString(uploadValue);
            }

        } else {
            dataVal = formFieldVO.defaultValue();
            extValue = StrUtil.EMPTY_JSON;
        }
        return Pair.of(dataVal, extValue);
    }
}

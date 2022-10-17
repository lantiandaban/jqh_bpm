

package com.srm.bpm.logic.service.impl;

import com.google.common.base.Preconditions;
import com.google.common.base.Strings;
import com.google.common.collect.Lists;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.srm.bpm.infra.entity.FormDesingerEntity;
import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.bpm.infra.entity.ToaFormEntity;
import com.srm.bpm.infra.entity.ToaProcessEntity;
import com.srm.bpm.infra.service.FormDesingerService;
import com.srm.bpm.infra.service.FormDetailSettingService;
import com.srm.bpm.infra.service.FormFieldService;
import com.srm.bpm.infra.service.FormTableService;
import com.srm.bpm.infra.service.ToaFormService;
import com.srm.bpm.infra.service.ToaProcessService;
import com.srm.bpm.logic.constant.FormConst;
import com.srm.bpm.logic.constant.StringPool;
import com.srm.bpm.logic.define.FormXtype;
import com.srm.bpm.logic.define.WidgetOnlyType;
import com.srm.bpm.logic.define.widget.WidgetField;
import com.srm.bpm.logic.dto.FormAttrDto;
import com.srm.bpm.logic.dto.FormColumnDto;
import com.srm.bpm.logic.dto.FormDesignerSaveDto;
import com.srm.bpm.logic.dto.FormTableDto;
import com.srm.bpm.logic.dto.FormTableFieldDto;
import com.srm.bpm.logic.service.ProcessFormLogic;
import com.srm.bpm.logic.constant.ProcessAdminCode;
import com.srm.bpm.logic.constant.ProcessCode;
import com.srm.common.data.exception.RbException;
import com.srm.common.util.datetime.DateTimeUtil;
import com.srm.common.util.serialize.JsonMapper;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static com.srm.bpm.logic.error.BillCode.FROM_DESIGN_FILED_SAVE_ERROR;
import static com.srm.bpm.logic.error.BillCode.FROM_DESIGN_SAVE_ERROR;
import static org.apache.commons.lang3.StringUtils.EMPTY;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@RequiredArgsConstructor
@Service
@Slf4j
public class ProcessFormLogicImpl implements ProcessFormLogic {
    private static final String FORM_TABLE_NAME_PREFIX = "form_sheet_main_";
    private final ToaProcessService toaProcessService;

    private final ToaFormService toaFormService;

    private final FormDesingerService formDesingerService;

    private final FormTableService formTableService;

    private final FormFieldService formFieldService;

    private final FormDetailSettingService formDetailSettingService;


    /**
     * 保存表单元素
     * <p>
     * 1. 解析出表单的字段信息
     * <p>
     * 2. 解析出表单所使用的表达式信息
     * <p>
     * 3. 存储表单信息
     *
     * @param data 表单设计
     * @return 是否成功
     */
    @Override
    public boolean saveForm(String data) {
        FormDesignerSaveDto formDesignerDto = JSON.parseObject(data, FormDesignerSaveDto.class);
        final FormAttrDto formAttr = formDesignerDto.getAttr();
        final List<List<FormColumnDto>> columnItems = formDesignerDto.getColumnItems();

        final long processId = formAttr.getId();
        if (processId <= 0) {
            // 流程数据不存在
            log.error("流程id传递空值了，无法进行处理");
            throw new RbException(StringPool.EMPTY, ProcessCode.PROCESS_ID_REQUIRED);

        }

        final ToaProcessEntity process = toaProcessService.getById(processId);
        if (process == null) {
            throw new RbException(StringPool.EMPTY, ProcessCode.PROCESS_NOT_FOUND);
        }

        try {
            // fixed: 图标不更换
            process.setIconId(formAttr.getIcon());
            toaProcessService.upldate(process);
            final ToaFormEntity form = saveFormAttr(formDesignerDto, processId);
            saveFromColumn(columnItems, form);
            saveFrom(data, form);
            return true;
        } catch (Exception e) {
            log.error("保存表单 [{}] 信息出现错误", JsonMapper.toJson(formDesignerDto), e);
            throw new RbException(StringPool.EMPTY, ProcessAdminCode.FORM_SAVE_ERROR);
        }
    }

    private void saveFrom(String formDesingerData, ToaFormEntity form) {
        Preconditions.checkNotNull(form, "表单信息不能为空");
        final Long formId = form.getId();
        Preconditions.checkNotNull(formId, "表单信息不能为空");
        FormDesingerEntity formDesinger = formDesingerService.getOne(Wrappers.lambdaQuery(FormDesingerEntity.class).eq(FormDesingerEntity::getFormId, formId));
        boolean state;
        if (formDesinger == null) {
            formDesinger = new FormDesingerEntity();
            formDesinger.setFormId(formId);
            formDesinger.setDesingerJson(formDesingerData);
            formDesinger.setColumns(StrUtil.EMPTY_JSON);
            state = formDesingerService.insert(formDesinger);
        } else {
            formDesinger.setDesingerJson(formDesingerData);
            state = formDesingerService.upldate(formDesinger);
        }
        if (!state) {
            log.error("form desinger save error!");
            throw new RbException(FROM_DESIGN_SAVE_ERROR);
        }
    }

    private void saveFromColumn(List<List<FormColumnDto>> columnItems, ToaFormEntity form) {
        final Long formId = form.getId();
        // 先找到原来是否存在字段，如果存在，则进行逻辑删除
        final List<FormFieldEntity> formFieldList = formFieldService.list(Wrappers.lambdaQuery(FormFieldEntity.class).eq(FormFieldEntity::getFormId, formId));
        if (CollectionUtil.isNotEmpty(formFieldList)) {
            // 如果存在，则进行逻辑删除
            List<Long> deleteIds = Lists.newArrayList();
            for (FormFieldEntity formField : formFieldList) {
                deleteIds.add(formField.getId());
            }
            final boolean deleteState = this.formFieldService.removeByIds(deleteIds);
            if (!deleteState) {
                log.error("form {} from column save has error!", formId);
                throw new RbException(FROM_DESIGN_FILED_SAVE_ERROR);
            }
        }

        final String tableName = form.getTableName();
        List<Pair<FormTableDto, List<FormTableFieldDto>>> details = Lists.newArrayList();

        FormTableDto mainTable = new FormTableDto();
        mainTable.setTableName(tableName);
        mainTable.setComment(form.getName());

        final List<FormFieldEntity> formFields = Lists.newArrayList();

        final List<FormTableFieldDto> tableFields = Lists.newArrayList();
        List<FormFieldEntity> detailFields = Lists.newArrayList();
        int sort = 1;
        int detailOrder = 1;
        for (List<FormColumnDto> columnItem : columnItems) {
            for (FormColumnDto formColumnDto : columnItem) {
                final String widgetJSON = formColumnDto.getWidget();
                if (Strings.isNullOrEmpty(widgetJSON)) {
                    continue;
                }
                WidgetOnlyType widget = JSON.parseObject(widgetJSON, WidgetOnlyType.class);

                final WidgetField widgetFiled = widget.getXtype().toField(widgetJSON);
                if (widgetFiled == null) {
                    continue;
                }

                final FormFieldEntity formField = widgetFiled.toField(formId, sort);
                formFields.add(formField);

                final List<FormTableFieldDto> tableField = widgetFiled.toTableField();
                tableFields.addAll(tableField);

                final FormXtype xtype = widget.getXtype();
                switch (xtype) {
                    case detailgroup:
                        final long detailFiledId = IdWorker.getId();
                        formField.setId(detailFiledId);

                        final List<WidgetField> formItems = widgetFiled.items();
                        if (CollectionUtil.isNotEmpty(formItems)) {
                            FormTableDto detailTable = new FormTableDto();
                            detailTable.setTableName(tableName + FormConst.DETAIL_TABLENAME + detailOrder);
                            detailTable.setComment(form.getName() + widgetFiled.title());

                            List<FormTableFieldDto> detailTableFields = Lists.newArrayList();

                            int detailSort = 1;
                            for (WidgetField detailWidget : formItems) {
                                final FormFieldEntity detailField;
                                detailField = detailWidget.toField(formId, detailSort, detailFiledId);
                                formFields.add(detailField);
                                detailFields.add(detailField);

                                final List<FormTableFieldDto> detailTableField;
                                detailTableField = detailWidget.toTableField();

                                if (CollectionUtil.isNotEmpty(detailTableField)) {
                                    detailTableFields.addAll(detailTableField);
                                }

                                detailSort++;
                            }

                            details.add(Pair.of(detailTable, detailTableFields));

                            detailOrder++;
                        }

                        break;
                    default:
                        break;
                }
            }
            sort++;
        }
        if (CollectionUtil.isEmpty(formFields)) {
            return;
        }
        if (CollectionUtil.isNotEmpty(detailFields)) {
            formDetailSettingService.createDetailSetting(detailFields, form);
        }

        final boolean fieldState = this.formFieldService.saveBatch(formFields);
        if (!fieldState) {
            log.error("form field save has error!");
            throw new RbException(FROM_DESIGN_FILED_SAVE_ERROR);
        }

        // 创建物理表
        // 取得是否已经有物理表了
        final String tableExistName = formTableService.isTargetTableExistInDB(tableName);
        if (Strings.isNullOrEmpty(tableExistName)) {
            // 创建物理表
            formTableService.createMainTable(mainTable, tableFields);
            if (CollectionUtil.isNotEmpty(details)) {
                for (Pair<FormTableDto, List<FormTableFieldDto>> tablePair : details) {
                    final FormTableDto table = tablePair.getKey();
                    final List<FormTableFieldDto> fields = tablePair.getValue();
                    formTableService.createDetailTable(table, fields);
                }
            }
        } else {
            final List<String> columns = formTableService.findColumnNameByTableName(tableName);
            final List<FormTableFieldDto> mainAddFields = Lists.newArrayList();
            // 查找新添加的字段, 忽略已已删除的字段
            for (FormTableFieldDto tableField : tableFields) {
                if (!columns.contains(tableField.getFieldName())) {
                    mainAddFields.add(tableField);
                }
            }
            for (FormTableFieldDto mainAddField : mainAddFields) {
                formTableService.addColumn(tableName, mainAddField);
            }

            if (CollectionUtil.isNotEmpty(details)) {
                for (Pair<FormTableDto, List<FormTableFieldDto>> detail : details) {
                    final List<FormTableFieldDto> detailAddColumns = Lists.newArrayList();
                    final FormTableDto detailTable = detail.getKey();
                    String detailTableName = detailTable.getTableName();
                    final List<String> detailTableColumns;
                    detailTableColumns = formTableService.findColumnNameByTableName(detailTableName);
                    if (CollectionUtil.isEmpty(detailTableColumns)) {
                        // 表示不存在明细物理表

                        formTableService.createDetailTable(detailTable, detail.getValue());
                    } else {
                        // 查找新添加的字段, 忽略已已删除的字段
                        for (FormTableFieldDto tableField : detail.getValue()) {
                            if (!detailTableColumns.contains(tableField.getFieldName())) {
                                detailAddColumns.add(tableField);
                            }
                        }

                        for (FormTableFieldDto addField : detailAddColumns) {
                            formTableService.addColumn(detailTableName, addField);
                        }
                    }
                }
            }
        }
    }

    private ToaFormEntity saveFormAttr(FormDesignerSaveDto formDesignerDto, long processId) {
        FormAttrDto formAttr = formDesignerDto.getAttr();
        // 获取是否已经存在流程设置了
        ToaFormEntity form = toaFormService.getOne(Wrappers.lambdaQuery(ToaFormEntity.class).eq(ToaFormEntity::getProcessId, processId));

        final List<List<FormColumnDto>> columnItems = formDesignerDto.getColumnItems();
        // 判断是否有明细字段
        boolean detailFileldFlag = containsDetailFileldFlag(columnItems);

        final boolean state;
        if (form == null) {
            // 不存在表单
            int size = formTableService.findByTableSize(FORM_TABLE_NAME_PREFIX);
            if (size <= 0) {
                size = 1;
            }

            form = new ToaFormEntity();
            form.setTableName(FORM_TABLE_NAME_PREFIX +  (size+1));
            form.setProcessFlag(1);
            form.setProcessId(processId);
            form.setClientAppFlag(0);
            form.setCode(DateTimeUtil.format(LocalDateTime.now(), "yyyyMMdd") + RandomStringUtils.randomNumeric(4));
            form.setDescription(formAttr.getDescription());
            if (formAttr.getIcon() > 0) {
                form.setIcon(String.valueOf(formAttr.getIcon()));
            }
            form.setLayout(formAttr.getLayout().getColgroup().size());
            form.setName(formAttr.getName());
            form.setSort(1);
            form.setDetailFieldFlag(detailFileldFlag ? 1 : 0);
            form.setDocumentation(EMPTY);
            form.setStyle(JSON.toJSONString(formAttr.getStyle()));
            state = toaFormService.insert(form);
        } else {
            if (StringUtils.isEmpty(form.getTableName())) {
                int size = formTableService.findByTableSize(FORM_TABLE_NAME_PREFIX);
                if (size <= 0) {
                    size = 1;
                }
                form.setTableName(FORM_TABLE_NAME_PREFIX +  (size+1));
            }
            form.setDetailFieldFlag(detailFileldFlag ? 1 : 0);
            form.setDescription(formAttr.getDescription());
            if (formAttr.getIcon() > 0) {
                form.setIcon(String.valueOf(formAttr.getIcon()));
            }
            form.setLayout(formAttr.getLayout().getColgroup().size());
            form.setName(formAttr.getName());
            state = toaFormService.upldate(form);
        }
        if (!state) {
            log.error("process from save error!");
            throw new RbException(FROM_DESIGN_SAVE_ERROR);
        }

        return form;
    }

    /**
     * 是否包含明细字段，用于控制是否有明细导入的处理
     *
     * @param columnItems 字段信息
     * @return true 有明细字段
     */
    private boolean containsDetailFileldFlag(List<List<FormColumnDto>> columnItems) {
        if (CollectionUtil.isNotEmpty(columnItems)) {
            for (List<FormColumnDto> formColumns : columnItems) {
                for (FormColumnDto formColumn : formColumns) {
                    final String widgetJSON = formColumn.getWidget();
                    if (Strings.isNullOrEmpty(widgetJSON)) {
                        continue;
                    }
                    WidgetOnlyType widgetOnlyType = JSON.parseObject(widgetJSON, WidgetOnlyType.class);
                    final FormXtype xtype = widgetOnlyType.getXtype();
                    switch (xtype) {
                        case detailgroup:
                            return true;
                        default:
                            break;
                    }
                }
            }
        }
        return false;
    }
}

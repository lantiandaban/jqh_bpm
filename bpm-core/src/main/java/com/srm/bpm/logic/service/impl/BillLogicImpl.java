

package com.srm.bpm.logic.service.impl;

import com.google.common.base.MoreObjects;
import com.google.common.base.Optional;
import com.google.common.base.Preconditions;
import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.eventbus.EventBus;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.core.toolkit.StringPool;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.bpm.infra.entity.BillBizDataEntity;
import com.srm.bpm.infra.entity.BillDataJsonEntity;
import com.srm.bpm.infra.entity.BillTaskEntity;
import com.srm.bpm.infra.entity.FormDesingerEntity;
import com.srm.bpm.infra.entity.FormFieldEntity;
import com.srm.bpm.infra.entity.FormSettingEntity;
import com.srm.bpm.infra.entity.FormValidationEntity;
import com.srm.bpm.infra.entity.ProcessNodeApproverEntity;
import com.srm.bpm.infra.entity.ProcessNodeExtendEntity;
import com.srm.bpm.infra.entity.ProcessTypeEntity;
import com.srm.bpm.infra.entity.ToaBillEntity;
import com.srm.bpm.infra.entity.ToaProcessEntity;
import com.srm.bpm.infra.po.BillApprovalHistoryPO;
import com.srm.bpm.infra.po.BillItemPO;
import com.srm.bpm.infra.po.FormFieldPO;
import com.srm.bpm.infra.po.ProcessDetailPO;
import com.srm.bpm.infra.po.ProcessGridPO;
import com.srm.bpm.infra.service.BillBizDataService;
import com.srm.bpm.infra.service.BillDataJsonService;
import com.srm.bpm.infra.service.BillReadRecordService;
import com.srm.bpm.infra.service.BillTaskService;
import com.srm.bpm.infra.service.FormDesingerService;
import com.srm.bpm.infra.service.FormFieldService;
import com.srm.bpm.infra.service.FormSettingService;
import com.srm.bpm.infra.service.FormValidationService;
import com.srm.bpm.infra.service.ProcessNodeApproverService;
import com.srm.bpm.infra.service.ProcessNodeExtendService;
import com.srm.bpm.infra.service.ProcessNodeFormFieldService;
import com.srm.bpm.infra.service.ProcessTypeService;
import com.srm.bpm.infra.service.SerialNumberLogic;
import com.srm.bpm.infra.service.ToaBillService;
import com.srm.bpm.infra.service.ToaProcessService;
import com.srm.bpm.logic.constant.BillAction;
import com.srm.bpm.logic.constant.BillStatus;
import com.srm.bpm.logic.constant.BillTaskStatus;
import com.srm.bpm.logic.constant.BillTaskType;
import com.srm.bpm.logic.constant.BizType;
import com.srm.bpm.logic.constant.CountersignType;
import com.srm.bpm.logic.constant.NodeLinkType;
import com.srm.bpm.logic.constant.ProcessConst;
import com.srm.bpm.logic.context.BillDataContext;
import com.srm.bpm.logic.converts.BillBasicConvert;
import com.srm.bpm.logic.converts.FormBasicConvert;
import com.srm.bpm.logic.converts.ProcessBasicConvert;
import com.srm.bpm.logic.define.FormXtype;
import com.srm.bpm.logic.dto.BillActionParamDTO;
import com.srm.bpm.logic.dto.ProcessDetailDTO;
import com.srm.bpm.logic.dto.UserInfoDTO;
import com.srm.bpm.logic.dto.UserOrgDTO;
import com.srm.bpm.logic.dto.ValidationResultDTO;
import com.srm.bpm.logic.error.BillCode;
import com.srm.bpm.logic.event.BillAgreeEvent;
import com.srm.bpm.logic.event.BillRepulseEvent;
import com.srm.bpm.logic.query.list.ApprovedBillQuery;
import com.srm.bpm.logic.query.list.CcBillQuery;
import com.srm.bpm.logic.query.list.DraftBillQuery;
import com.srm.bpm.logic.query.list.MeCreateBillQuery;
import com.srm.bpm.logic.query.list.TodoBillQuery;
import com.srm.bpm.logic.service.BillBpmnLogic;
import com.srm.bpm.logic.service.BillBtnLogic;
import com.srm.bpm.logic.service.BillDataJsonLogic;
import com.srm.bpm.logic.service.BillItemLogic;
import com.srm.bpm.logic.service.BillLogic;
import com.srm.bpm.logic.service.BillTitleLogic;
import com.srm.bpm.logic.service.BillValidationLogic;
import com.srm.bpm.logic.service.CallBackLogic;
import com.srm.bpm.logic.service.FlowMsgLogic;
import com.srm.bpm.logic.service.LoginUserHolder;
import com.srm.bpm.logic.service.UserCenterlogic;
import com.srm.bpm.logic.util.DateToStringUtil;
import com.srm.bpm.logic.vo.BillApprovalHistoryVO;
import com.srm.bpm.logic.vo.BillAssociatedVO;
import com.srm.bpm.logic.vo.BillDetailVO;
import com.srm.bpm.logic.vo.BillItemVO;
import com.srm.bpm.logic.vo.BillOpinionVO;
import com.srm.bpm.logic.vo.CountersignVO;
import com.srm.bpm.logic.vo.FormFieldVO;
import com.srm.bpm.logic.vo.FormPermissionVO;
import com.srm.bpm.logic.vo.ProcessTypeVO;
import com.srm.bpm.logic.vo.ProcessVO;
import com.srm.config.SpringContextHolder;
import com.srm.bpm.logic.constant.BillBtnConst;
import com.srm.bpm.logic.constant.Const;
import com.srm.bpm.logic.constant.FastJsonType;
import com.srm.bpm.logic.constant.ProcessCode;
import com.srm.common.data.exception.RbException;
import com.srm.common.util.bean.BeanUtil;
import com.srm.common.util.datetime.DateTimeUtil;

import org.activiti.engine.runtime.ProcessInstance;
import org.apache.commons.codec.binary.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.lang3.tuple.Triple;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TimerTask;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static com.srm.bpm.logic.error.BillCode.APPROVAL_STATUS_ERROR;
import static com.srm.bpm.logic.error.BillCode.BILL_CANCEL_ONAGREE;
import static com.srm.bpm.logic.error.BillCode.BILL_HAS_COMPLETE;
import static com.srm.bpm.logic.error.BillCode.BILL_NOT_IN_DRAFTS;
import static com.srm.bpm.logic.error.BillCode.Bill_APPROVAL_IN;
import static com.srm.bpm.logic.error.BillCode.ENDORSE_CANNOT_IN_NODE;
import static com.srm.bpm.logic.error.BillCode.TARGET_TASK_NULL;
import static com.srm.bpm.logic.error.BillCode.TURN_CANNOT_IN_NODE;
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
public class BillLogicImpl implements BillLogic {
    private final ToaProcessService processService;
    private final ProcessNodeExtendService nodeExtendService;
    private final FormDesingerService formDesingerService;
    private final ProcessNodeFormFieldService nodeFieldPermission;
    private final FormFieldService formFieldService;
    private final UserCenterlogic userCenterlogic;
    private final BillBtnLogic billBtnLogic;
    private final ToaBillService billService;
    private final BillDataJsonService billDataJsonService;
    private final BillTaskService billTaskService;
    private final BillReadRecordService billReadRecordService;
    private final BillBizDataService billBizDataService;

    private final BillBpmnLogic billBpmnLogic;
    private final BillDataJsonLogic billDataJsonLogic;
    private final BillItemLogic billItemLogic;
    private final EventBus eventBus;
    private final ProcessNodeApproverService nodeApproverService;
    private final LoginUserHolder loginUserHolder;
    private final FlowMsgLogic flowMsgLogic;
    private final BillTitleLogic billTitleLogic;
    private final SerialNumberLogic serialNumberLogic;
    private final FormValidationService formValidationService;
    private final FormSettingService formSettingService;
    private final CallBackLogic callBackLogic;
    private final FormBasicConvert formBasicConvert;
    private final BillBasicConvert billBasicConvert;
    private final ProcessTypeService processTypeService;
    private final ProcessBasicConvert processBasicConvert;

    /**
     * 创建审批单
     *
     * @param processId 业务流程主键
     * @return 审批单数据信息
     */
    @Override
    public BillDetailVO create(long processId) {
        final ProcessDetailDTO process = checkProcess(processId);
        final FormDesingerEntity formDesinger;
        formDesinger = this.formDesingerService.getByProcessId(processId);
        // 意见信息
        final List<BillOpinionVO> opinionVOS = Lists.newArrayList();
        String firstNodeId = StringPool.EMPTY;

        final List<ProcessNodeExtendEntity> taskNodes =
                nodeExtendService.findTaskNodeByProcess(processId);
        if (CollectionUtil.isNotEmpty(taskNodes)) {
            for (ProcessNodeExtendEntity taskNode : taskNodes) {
                final String linkType = taskNode.getLinkType();
                if (StringUtils.equals(linkType, NodeLinkType.create.name())) {
                    firstNodeId = taskNode.getNodeId();
                } else if (StringUtils.equals(linkType, NodeLinkType.approvl.name())) {
                    // 如果是审批，则加入意见
                    BillOpinionVO billOpinionVO = new BillOpinionVO();
                    billOpinionVO.setTitle(taskNode.getNodeName());
                    opinionVOS.add(billOpinionVO);
                }
            }
        }
        // 获取授权信息
        final List<FormPermissionVO> permissionVOS = formBasicConvert.formPermissionPOtoVO(
                nodeFieldPermission.nodeFieldPermission(processId, firstNodeId));
        // 获取标题字段
        final ToaProcessEntity byId = processService.getById(processId);
        final String code =
                DateTimeUtil.format(LocalDateTime.now(), "yyyyMMddHHmm") + RandomUtil.randomNumbers(
                        6);
        // 获取标题字段

        final UserInfoDTO userInfoByCode =
                userCenterlogic.getUserInfoByCode(loginUserHolder.getUserCode());
        final String title = billTitleLogic.getTitle(processId, userInfoByCode.getNickname());
        final Map<String, Object> formData = bizFormData(process, userInfoByCode, title);
        // 按钮控制
        final List<String> btns = billBtnLogic.findBtnsOnCreateBill(process);
        return BillDetailVO.<String>builder()
                .title(title)
                .code(code)
                .form(formDesinger.getDesingerJson())
                .formData(formData)
                .processId(processId)
                .opinions(opinionVOS)
                .permission(permissionVOS)
                .btns(btns)
                .mode("create")
                .build();
    }

    /**
     * 通过bill的id查询
     *
     * @param billId 审批单主键
     * @return 审批单信息
     */
    @Override
    public BillDetailVO findBillDetail(long billId, String page) {
        final ToaBillEntity bill = billService.getById(billId);
        if (bill == null) {
            throw new RbException(StringPool.EMPTY, BillCode.BILL_NOT_FOUND);
        }
        final BillDataJsonEntity billDataJson = billDataJsonService.getOne(
                Wrappers.lambdaQuery(BillDataJsonEntity.class)
                        .eq(BillDataJsonEntity::getBillId, billId));
        if (null == billDataJson) {
            throw new RbException(StringPool.EMPTY, BillCode.BILL_NOT_FOUND);
        }
        final BillDetailVO.BillDetailVOBuilder<String> detailBuilder;
        detailBuilder = billDetailBuilder(billDataJson, bill);
        final FormSettingEntity byProcess = formSettingService.findByProcess(bill.getProcessId());
        if (!Objects.isNull(byProcess)) {
            if (!Strings.isNullOrEmpty(byProcess.getApproveLink())) {
                detailBuilder.approveLink(byProcess.getApproveLink().trim());
            }
            if (!Objects.isNull(byProcess.getApproveFormHeight())) {
                detailBuilder.approveFormHeight(byProcess.getApproveFormHeight());
            }
        }
        detailBuilder.selfTaskNames(getSelfNodeName(billId, loginUserHolder.getUserCode(), page));
        final List<BillOpinionVO> opinionVOS = billOpinions(bill);
        final String formSchema = billDataJson.getFormSchema();
        return detailBuilder.form(formSchema)
                .opinions(opinionVOS)
                .title(bill.getTitle())
                .code(bill.getCode())
                .mode("edit")
                .build();
    }

    private Set<String> getSelfNodeName(long billId, String user, String page) {
        if (page.equals("view")) {
            List<BillTaskEntity> billTaskEntities =
                    billTaskService.findApprovedByBillAndUser(billId, user);
            final Set<String> nodeNames = billTaskEntities.stream()
                    .map(BillTaskEntity::getNodeName)
                    .collect(Collectors.toSet());
            return nodeNames;
        } else {
            List<BillTaskEntity> billTaskEntities =
                    billTaskService.findApprovingByBillAndUser(billId, user);
            final Set<String> nodeNames = billTaskEntities.stream()
                    .map(BillTaskEntity::getNodeName)
                    .collect(Collectors.toSet());
            return nodeNames;
        }
    }

    /**
     * 通过bill的id查询
     */
    @Override
    public BillDetailVO findBillDetailModeView(long billId, String page) {
        final ToaBillEntity bill = billService.getById(billId);
        if (bill == null) {
            throw new RbException(StringPool.EMPTY, BillCode.BILL_NOT_FOUND);
        }
        final BillDataJsonEntity billDataJson = billDataJsonService.getOne(
                Wrappers.lambdaQuery(BillDataJsonEntity.class)
                        .eq(BillDataJsonEntity::getBillId, billId));
        if (null == billDataJson) {
            throw new RbException(StringPool.EMPTY, BillCode.BILL_NOT_FOUND);
        }
        final BillDetailVO.BillDetailVOBuilder<String> detailBuilder;
        detailBuilder = billDetailBuilder(billDataJson, bill, page);
        final FormSettingEntity byProcess = formSettingService.findByProcess(bill.getProcessId());
        if (!Objects.isNull(byProcess)) {
            if (!Strings.isNullOrEmpty(byProcess.getApproveLink())) {
                detailBuilder.approveLink(byProcess.getApproveLink().trim());
            }
            if (!Objects.isNull(byProcess.getApproveFormHeight())) {
                detailBuilder.approveFormHeight(byProcess.getApproveFormHeight());
            }
        }
        detailBuilder.selfTaskNames(getSelfNodeName(billId, loginUserHolder.getUserCode(), page));
        final List<BillOpinionVO> opinionVOS = billOpinions(bill);
        final String formSchema = billDataJson.getFormSchema();
        return detailBuilder.form(formSchema)
                .code(bill.getCode())
                .opinions(opinionVOS)
                .mode("view")
                .build();
    }

    /**
     * 设置某个员工已经读取了某个审批单
     *
     * @param billId 审批单ID
     * @return 是否操作成功
     */
    @Override
    public boolean readBill(long billId) {
        final ToaBillEntity bill = billService.getById(billId);
        if (bill == null) {
            throw new RbException(BillCode.BILL_NOT_FOUND);
        }

        final String userCode = loginUserHolder.getUserCode();
        // 不是自己发起的，记录读取
        final String sender = bill.getSender();
        return sender.equals(userCode) || billReadRecordService.readBillByUserCode(billId,
                userCode);
    }

    /**
     * 保存草稿箱
     *
     * @param processId    业务流程
     * @param billId       表单id
     * @param formDataJson 表单数据
     * @return 审批单
     */
    @Override
    public BillItemVO saveDrafts(long processId, long billId, String formDataJson) {
        Preconditions.checkNotNull(formDataJson);
        final ProcessDetailPO processDetail = this.processService.findDetailById(processId);
        final Map<String, Object> dataMap =
                JSON.parseObject(formDataJson, FastJsonType.MAP_OBJECT_TR);
        final BillDataContext billDataValue;
        billDataValue = this.resolveFormData(billId, processDetail, dataMap);
        final ToaBillEntity bill;
        final String userCode = loginUserHolder.getUserCode();
        final UserInfoDTO userInfoByCode = userCenterlogic.getUserInfoByCode(userCode);
        final boolean state;
        if (billId <= 0) {
            bill = createBill(processDetail, BillStatus.DRAFTS, billDataValue, userInfoByCode);
            bill.setStartTime(DateTimeUtil.unixTime());
            state = billService.insert(bill);
        } else {
            bill = billService.getById(billId);
            if (bill.getStatus() != BillStatus.DRAFTS.getStatus()) {
                throw new RbException(BILL_NOT_IN_DRAFTS);
            }
            bill.setStartTime(DateTimeUtil.unixTime());
            bill.setAttachmentFlag(billDataValue.isAttachment() ? 1 : 0);
            bill.setUpdateTime(LocalDateTime.now());
            state = billService.updateById(bill);
        }
        if (state) {
            billDataJsonLogic.saveByBillData(billDataValue, formDataJson);
            billBizDataService.saveByBillData(billDataValue);
        }
        return BillItemVO.toVO(bill, processDetail);
    }

    /**
     * 获取我已审批的审批单
     *
     * @param pageNo   当前页
     * @param pageSize 每页数量
     * @param query    查询参数
     * @return 数据和总数
     */
    @Override
    public Pair<List<BillItemVO>, Long> findApproved(
            Integer pageNo, Integer pageSize, ApprovedBillQuery query
    ) {
        Page page = new Page<>(pageNo, pageSize);
        final List<BillItemPO> billItemDtos;
        final String userCode = loginUserHolder.getUserCode();
        billItemDtos = this.billService.findApprovedByEmployee(page, userCode, query);
        final Page<BillItemVO> billItemVOPage = toItemVOList(page, billItemDtos, userCode);
        return Pair.of(billItemVOPage.getRecords(), billItemVOPage.getTotal());
    }

    /**
     * 获取待我审批的审批单
     *
     * @param pageNo   当前页
     * @param pageSize 每页数量
     * @param query    查询参数
     * @return 数据和总数
     */
    @Override
    public Pair<List<BillItemVO>, Long> findTodo(
            Integer pageNo, Integer pageSize, TodoBillQuery query
    ) {
        Page page = new Page(pageNo, pageSize);
        List<Integer> statusList =
                Lists.newArrayList(BillStatus.APPROVAL.getStatus(), BillStatus.REFUSE.getStatus());
        final String userCode = loginUserHolder.getUserCode();
        final List<BillItemPO> billDatas =
                this.billService.findTodoByStatus(page, userCode, query, statusList);
        final Page<BillItemVO> billItemVOPage = toItemVOList(page, billDatas, userCode);
        return Pair.of(billItemVOPage.getRecords(), billItemVOPage.getTotal());
    }

    /**
     * 获取我发起的审批
     *
     * @param pageNo   当前页
     * @param pageSize 每页数量
     * @param query    查询参数
     * @return 数据和总数
     */
    @Override
    public Pair<List<BillItemVO>, Long> findMeCreate(
            Integer pageNo, Integer pageSize, MeCreateBillQuery query
    ) {
        Page page = new Page(pageNo, pageSize);
        final String userCode = loginUserHolder.getUserCode();
        final List<BillItemPO> billDatas =
                this.billService.findCreateByEmployee(page, userCode, query);
        final Page<BillItemVO> billItemVOPage = toItemVOList(page, billDatas, userCode);
        return Pair.of(billItemVOPage.getRecords(), billItemVOPage.getTotal());
    }

    /**
     * 我的草稿
     *
     * @param pageNo   当前页
     * @param pageSize 每页数量
     * @param query    查询参数
     * @return 数据和总数
     */
    @Override
    public Pair<List<BillItemVO>, Long> findDraft(
            Integer pageNo, Integer pageSize, DraftBillQuery query
    ) {
        Page page = new Page(pageNo, pageSize);
        final String userCode = loginUserHolder.getUserCode();
        final List<BillItemPO> billDatas =
                this.billService.findDraftsBySender(page, userCode, query);
        final Page<BillItemVO> billItemVOPage = toItemVOList(page, billDatas, userCode);
        return Pair.of(billItemVOPage.getRecords(), billItemVOPage.getTotal());
    }

    /**
     * 抄送我的
     *
     * @param pageNo   当前页
     * @param pageSize 每页数量
     * @param query    查询参数
     * @return 数据和总数
     */
    @Override
    public Pair<List<BillItemVO>, Long> findCc(
            Integer pageNo, Integer pageSize, CcBillQuery query
    ) {
        Page page = new Page(pageNo, pageSize);
        final String userCode = loginUserHolder.getUserCode();
        final List<BillItemPO> cc = this.billService.findCc(page, userCode, query);
        final Page<BillItemVO> billItemVOPage = toItemVOList(page, cc, userCode);
        return Pair.of(billItemVOPage.getRecords(), billItemVOPage.getTotal());
    }

    /**
     * 提交流程
     *
     * @param processId    业务流程
     * @param billId       审批单id
     * @param formDataJson 表单数据
     * @return 审批单
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public BillItemVO startFlow(
            long processId, long billId, String formDataJson, String nextApprover, String billCode
    ) {
        Preconditions.checkNotNull(formDataJson);
        final ProcessDetailPO processDetail = processService.findDetailById(processId);
        final Map<String, Object> dataMap =
                JSON.parseObject(formDataJson, FastJsonType.MAP_OBJECT_TR);
        final String userCode = loginUserHolder.getUserCode();
        final UserInfoDTO userInfoDTO = userCenterlogic.getUserInfoByCode(userCode);
        final BillDataContext billDataValue;
        billDataValue = this.resolveFormData(billId, processDetail, dataMap);
        if (!Strings.isNullOrEmpty(billCode)) {
            billDataValue.setCode(billCode);
        }
        //进行表单的验证
        final ValidationResultDTO validationResult;
        validationResult = validationBySubmitFlow(processDetail, billDataValue, userCode);
        //验证表示无法继续提交
        if (validationResult != null && !validationResult.getAllowGoOnFlag()) {
            throw new RbException(validationResult.getTipMessage(), BillCode.START_FLOW_ERROR);
        }
        final ToaBillEntity bill;
        if (billId <= 0) {
            bill = createBill(processDetail, BillStatus.APPROVAL, billDataValue, userInfoDTO);
            billService.insert(bill);
        } else {
            bill = billService.getById(billId);
            final Integer billStatus = bill.getStatus();
            BillStatus status = BillStatus.valueTo(billStatus);
            switch (status) {
                case ARCHIVE:
                case COMPLETE:
                    // 归档中和已完成，不能进行提交
                    throw new RbException(BILL_HAS_COMPLETE);
                case APPROVAL:
                    // 审批中中不能提交
                    throw new RbException(Bill_APPROVAL_IN);
                default:
                    break;
            }
            // fixed cancel flow resubmit title and code not update.
            final String title = billDataValue.getTitle();
            final String code = billDataValue.getCode();

            if (Strings.isNullOrEmpty(title)) {
                // 如果没有标题字段，则默认生成标题
                final String day = DateToStringUtil.yyyymmdashNow();
                final String processName = processDetail.getName();
                final String username = userInfoDTO.getNickname();
                String titleText = StrUtil.format("{}-{}-{}", processName, username, day);
                bill.setTitle(titleText);
            } else {
                bill.setTitle(title);
            }
            if (!Strings.isNullOrEmpty(code) && Strings.isNullOrEmpty(bill.getCode())) {
                bill.setCode(code);
            } else if (Strings.isNullOrEmpty(bill.getCode())) {
                // 生成默认流水号
                final String billCodeText = serialNumberLogic.dayPolling("bill_default_sn", 6);
                String codeText = StrUtil.format("{}", billCodeText);
                bill.setCode(codeText);
            }
        }
        //判断是否是退回的审批单，如果是退回审批单，需要直接提交到之前退回的节点
        if (billId > 0) {
            //需要把审批中的节点任务的排序迁移
            final BillTaskEntity createTaskByBill = billTaskService.findCreateTaskByBill(billId);
            if (!Objects.isNull(createTaskByBill)) {
                createTaskByBill.setDateline(DateTimeUtil.unixTime());
                final Long sourceTaskId = createTaskByBill.getSourceTaskId();
                if (!Objects.isNull(sourceTaskId) && sourceTaskId.compareTo(0L) != 0) {
                    //找到审批中的节点，然后把排序前移
                    final BillTaskEntity byId = billTaskService.getById(sourceTaskId);
                    final String taskId = byId.getTaskId();
                    final List<BillTaskEntity> approvingByBillAndTaskId =
                            billTaskService.findApprovingByBillAndTaskId(billId, taskId);
                    for (BillTaskEntity billTaskEntity : approvingByBillAndTaskId) {
                        billTaskEntity.setSort(DateTimeUtil.timeMills());
                    }
                    //                    approvingByBillAndTaskId.add(createTaskByBill);
                    byId.setId(null);
                    byId.setOpinion(null);
                    byId.setNodeStatus(BillTaskStatus.APPROVAL.getStatus());
                    byId.setSort(DateTimeUtil.timeMills());
                    billTaskService.insert(byId);
                    if (CollectionUtil.isNotEmpty(approvingByBillAndTaskId)) {
                        billTaskService.updateBatchById(approvingByBillAndTaskId);
                    }
                    bill.setStatus(BillStatus.APPROVAL.getStatus());
                    boolean state = billService.upldate(bill);
                    if (state) {
                        billDataJsonLogic.saveByBillData(billDataValue, formDataJson);
                        billBizDataService.saveByBillData(billDataValue);
                    }
                    return BillItemVO.toVO(bill, processDetail);
                }
            }
        }
        // 先发起流程
        final Optional<ProcessInstance> processInstanceOpt;
        processInstanceOpt =
                billBpmnLogic.startFlow(billDataValue, processDetail, userInfoDTO, nextApprover);
        if (processInstanceOpt.isPresent()) {
            final ProcessInstance processInstance = processInstanceOpt.get();
            final boolean state;
            final LocalDateTime now = LocalDateTime.now();
            final int unixTime = DateTimeUtil.unixTime();
            if (billId <= 0) {
                bill.setProcessInstanceId(processInstance.getId());
                bill.setStartTime(unixTime);
                state = billService.updateById(bill);
            } else {
                final int status = MoreObjects.firstNonNull(bill.getStatus(), -1);
                BillStatus billStatus = BillStatus.valueTo(status);
                switch (billStatus) {
                    case DRAFTS: {
                        bill.setAttachmentFlag(billDataValue.isAttachment() ? 1 : 0);
                        bill.setProcessInstanceId(processInstance.getId());
                        bill.setUpdateTime(now);
                        // fixed 修复先保存在提交的状态问题
                        bill.setStatus(BillStatus.APPROVAL.getStatus());
                        bill.setStartTime(unixTime);
                        state = billService.updateById(bill);
                        break;
                    }
                    case REFUSE:
                    case CANCEL: {
                        bill.setAttachmentFlag(billDataValue.isAttachment() ? 1 : 0);
                        bill.setProcessInstanceId(processInstance.getId());
                        bill.setUpdateTime(now);
                        bill.setStatus(BillStatus.APPROVAL.getStatus());
                        state = billService.updateById(bill);
                        // 取得审批任务信息进行更新
                        //                        billTaskService.updateByReFullIn(billId, userInfoDTO.getCode());
                        break;
                    }
                    default:
                        throw new RbException(BILL_NOT_IN_DRAFTS);
                }

            }
            if (state) {
                billDataJsonLogic.saveByBillData(billDataValue, formDataJson);
                billBizDataService.saveByBillData(billDataValue);
            }
            return BillItemVO.toVO(bill, processDetail);

        } else {
            throw new RbException(BillCode.START_FLOW_ERROR);
        }
    }

    private ValidationResultDTO validationBySubmitFlow(
            ProcessDetailPO processDetail, BillDataContext billDataValue, String userCode
    ) {
        final BillValidationLogic validationService = getValidationService(processDetail.getId());
        return validataionWithResult(billDataValue, userCode, validationService);
    }

    /**
     * 对草稿箱中的审批单进行直接提交
     *
     * @param billId    审批单主键
     * @param processId 业务流程
     * @return 审批单
     */
    @Override
    public BillItemVO sendProcess(
            long billId, long processId, String nextApprover
    ) {
        final ToaBillEntity bill = billService.getById(billId);
        if (bill == null) {
            throw new RbException(BillCode.BILL_NOT_FOUND);
        }
        //  去掉草稿箱的判断，通过具体执行函数来判断

        final BillDataJsonEntity billDataJson = billDataJsonService.getOne(
                Wrappers.lambdaQuery(BillDataJsonEntity.class)
                        .eq(BillDataJsonEntity::getBillId, billId));
        final String formData = billDataJson.getFormData();
        return this.startFlow(processId, billId, formData, nextApprover, StrUtil.EMPTY);
    }

    /**
     * 同意某个审批流程
     *
     * @param actionParam 审批操作参数
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void agreeFlow(BillActionParamDTO actionParam) {
        final long billId = actionParam.getBillId();
        final String taskId = actionParam.getTaskId();
        final String opinion = actionParam.getOpinion();
        final String userCode = actionParam.getUserCode();
        final String nextApprover = actionParam.getNextApprover();
        ToaBillEntity bill = billService.getById(billId);
        if (bill == null) {
            throw new RbException(BillCode.BILL_NOT_FOUND);
        }
        final int status = MoreObjects.firstNonNull(bill.getStatus(), 0);
        BillStatus billStatus = BillStatus.valueTo(status);
        switch (billStatus) {
            case REFUSE:
                BillAgreeEvent billAgreeEvent = new BillAgreeEvent();
                billAgreeEvent.setBillId(billId);
                eventBus.post(billAgreeEvent);
            case APPROVAL: {
                final Optional<BillTaskEntity> taskOpt;
                taskOpt =
                        billBpmnLogic.findTaskBybillAndEmployeeAndTaskId(billId, taskId, userCode);
                if (taskOpt.isPresent()) {
                    BillTaskEntity billTask = taskOpt.get();
                    billTask.setOpinion(opinion);
                    final int nodeStatus = billTask.getNodeStatus();
                    BillTaskStatus billTaskStatus = BillTaskStatus.valueTo(nodeStatus);
                    final Integer taskType = billTask.getTaskType();
                    final BillTaskType billTaskType = BillTaskType.forValue(taskType);
                    switch (billTaskType) {
                        case TRANSFER:
                        case TURN:
                        case DEFAULT:
                            switch (billTaskStatus) {
                                case APPROVAL:
                                    //需要增加会签判断
                                    final boolean goFlag = agreeIsGoOn(billTask);
                                    flowMsgLogic.sendMsg(Lists.newArrayList(billTask));
                                    if (goFlag) {
                                        this.billTaskService.agreeTask(billTask, userCode,
                                                actionParam);
                                        this.billItemLogic.updateByFormDataByBill(billId,
                                                actionParam.getFormData());
                                        //删除待审批的信息
                                        this.billTaskService.deleteApproval(billTask.getBillId(),
                                                billTask.getTaskId(),
                                                BillTaskStatus.APPROVAL.getStatus());
                                        this.billBpmnLogic.complete(bill, taskId, opinion, userCode,
                                                nextApprover, actionParam.getFormData(),
                                                billTask.getTaskNodeKey(), billTask.getTaskId());

                                    } else {
                                        this.billTaskService.agreeTask(billTask, userCode,
                                                actionParam);
                                    }
                                    break;
                                case AGREE:
                                case REFUSE:
                                    throw new RbException(BillCode.BILL_TASK_HAS_APPROVED);
                                default:
                                    throw new RbException(BillCode.BILL_TASK_NOT_APPROVAL);
                            }
                            break;
                        case ENDORSE:
                            switch (billTaskStatus) {
                                case APPROVAL:
                                    //加签处理，需要把当前审批人在当前节点的所有加签任务都审批通过
                                    List<BillTaskEntity> billTaskEntities =
                                            billTaskService.findEndorseByUserAndTaskId(billId,
                                                    taskId, userCode);
                                    List<BillTaskEntity> updates = Lists.newArrayList();
                                    List<BillTaskEntity> inserts = Lists.newArrayList();
                                    for (BillTaskEntity billTaskEntity : billTaskEntities) {
                                        final BillTaskEntity newBillTask =
                                                BeanUtil.sourceToTarget(billTask,
                                                        BillTaskEntity.class);
                                        billTaskEntity.setNodeStatus(
                                                BillTaskStatus.AGREE.getStatus());
                                        billTaskEntity.setDateline(DateTimeUtil.unixTime());
                                        billTaskEntity.setUpdateTime(LocalDateTime.now());
                                        billTaskEntity.setOpinion(actionParam.getOpinion());
                                        updates.add(billTaskEntity);
                                        newBillTask.setId(IdWorker.getId());
                                        newBillTask.setUserCode(billTaskEntity.getSourceUserCode());
                                        newBillTask.setTaskType(BillTaskType.DEFAULT.getValue());
                                        newBillTask.setSourceTaskId(null);
                                        newBillTask.setSourceUserCode(null);
                                        newBillTask.setSort(DateTimeUtil.timeMills());
                                        newBillTask.setCreationTime(LocalDateTime.now());
                                        inserts.add(newBillTask);
                                    }
                                    if (CollectionUtil.isNotEmpty(updates)) {
                                        billTaskService.updateBatchById(updates);
                                    }
                                    if (CollectionUtil.isNotEmpty(inserts)) {
                                        billTaskService.saveBatch(inserts);
                                    }
                                    List<BillTaskEntity> sends = Lists.newArrayList();
                                    sends.addAll(updates);
                                    sends.addAll(inserts);
                                    flowMsgLogic.sendMsg(sends);
                                    break;
                                case AGREE:
                                case REFUSE:
                                    throw new RbException(BillCode.BILL_TASK_HAS_APPROVED);
                                default:
                                    throw new RbException(BillCode.BILL_TASK_NOT_APPROVAL);
                            }

                            break;
                        default:
                            break;

                    }
                } else {
                    throw new RbException(BillCode.TASK_NOT_FOUND);
                }
                break;
            }
            case CANCEL:
                // Fixed #1286 APP端撤销后，门户端审批已撤销的审批单，提示“审批失败”
                throw new RbException(BILL_CANCEL_ONAGREE);
            default:
                throw new RbException(APPROVAL_STATUS_ERROR);
        }
    }

    /**
     * 拒绝某个审批流程
     *
     * @param actionParam 审批操作参数
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void refuseFlow(BillActionParamDTO actionParam) {
        final long billId = actionParam.getBillId();
        final String taskId = actionParam.getTaskId();
        final String opinion = actionParam.getOpinion();
        final String userCode = actionParam.getUserCode();
        final ToaBillEntity bill = billService.getById(billId);
        if (bill == null) {
            throw new RbException(BillCode.BILL_NOT_FOUND);
        }
        final int status = MoreObjects.firstNonNull(bill.getStatus(), 0);
        BillStatus billStatus = BillStatus.valueTo(status);
        switch (billStatus) {
            //            case REFUSE:
            //                //当前审批单是拒绝状态才会走这里
            //                BillRefuseEvent billAgreeEvent = new BillRefuseEvent();
            //                billAgreeEvent.setBillId(billId);
            //                billAgreeEvent.setProcessId(bill.getProcessId());
            //                eventBus.post(billAgreeEvent);
            case APPROVAL: {
                final Optional<BillTaskEntity> taskOpt;
                taskOpt =
                        billBpmnLogic.findTaskBybillAndEmployeeAndTaskId(billId, taskId, userCode);
                if (taskOpt.isPresent()) {
                    BillTaskEntity task = taskOpt.get();
                    final int taskNodeStatus = task.getNodeStatus();
                    BillTaskStatus billTaskStatus = BillTaskStatus.valueTo(taskNodeStatus);
                    switch (billTaskStatus) {
                        case APPROVAL:
                            refuseApproval(taskId, opinion, bill, userCode, task);
                            // 更新提交的formdata
                            final String formData = actionParam.getFormData();
                            if (!Strings.isNullOrEmpty(
                                    formData) && !org.apache.commons.lang3.StringUtils.equals("{}",
                                    formData)) {
                                this.billItemLogic.updateByFormDataByBill(billId, formData);
                            }
                            billTaskService.deleteApproval(task.getBillId(), task.getTaskId(),
                                    BillTaskStatus.APPROVAL.getStatus());
                            break;
                        case AGREE:
                        case REFUSE:
                            throw new RbException(BillCode.BILL_TASK_HAS_APPROVED);
                        default:
                            throw new RbException(APPROVAL_STATUS_ERROR);

                    }
                } else {
                    throw new RbException(StringPool.EMPTY, ProcessCode.PROCESS_ACTIVITI_ERROR);
                }
                break;
            }
            case ARCHIVE:
                throw new RbException(BillCode.ARCHIVE_STATUS_REFUSE);
            default:
                throw new RbException(APPROVAL_STATUS_ERROR);

        }
    }

    /**
     * 结束并设置完成审批单
     *
     * @param billId 审批单ID
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void complete(long billId, String action) {
        ToaBillEntity bill = new ToaBillEntity();
        final int dateline = DateTimeUtil.unixTime();
        bill.setId(billId);
        bill.setCompletionTime(dateline);
        bill.setStatus(BillStatus.COMPLETE.getStatus());
        bill.setArchivedTime(dateline);
        TimerTask businessTask = new TimerTask() {
            @Override
            public void run() {
                final ToaBillEntity byId = billService.getById(billId);
                billService.upldate(bill);
                if (action.equals(BillAction.refuse.name())) {
                    callBackLogic.callBack(byId.getProcessId(), billId,
                            BillTaskStatus.REFUSE.getStatus());
                } else {
                    BillTaskEntity a = new BillTaskEntity();
                    a.setBillId(byId.getId());
                    a.setUserCode(byId.getSender());
                    a.setNodeStatus(BillTaskStatus.COMPLATE.getStatus());
                    a.setNodeName(byId.getTitle());
                    a.setOpinion("通过");
                    flowMsgLogic.sendMsg(Lists.newArrayList(a));
                    callBackLogic.callBack(byId.getProcessId(), billId,
                            BillStatus.COMPLETE.getStatus());
                }
            }
        };
        CallBackThreadPoolManager.me().executeLog(businessTask);
    }

    /**
     * 获取某个审批单的审批历史记录
     *
     * @param billId 审批单
     * @return 审批历史记录
     */
    @Override
    public List<BillApprovalHistoryVO> findBillApprovalHistory(long billId) {
        final ToaBillEntity bill = billService.getById(billId);
        if (bill == null) {
            throw new RbException(BillCode.BILL_NOT_FOUND);
        }
        final List<BillApprovalHistoryPO> byBill = billTaskService.findByBill(bill);
        final Set<String> userCodes =
                byBill.stream().map(BillApprovalHistoryPO::getUserCode).collect(Collectors.toSet());
        final Set<String> userCodes1 = byBill.stream()
                .map(BillApprovalHistoryPO::getSourceUserCode)
                .collect(Collectors.toSet());
        final Set<String> userCodes2 = byBill.stream()
                .map(BillApprovalHistoryPO::getTargetUserCode)
                .collect(Collectors.toSet());
        userCodes.addAll(userCodes1);
        userCodes.addAll(userCodes2);
        final List<UserInfoDTO> userInfoDTOS = userCenterlogic.getUserByCodes(userCodes);
        if (CollectionUtil.isNotEmpty(userInfoDTOS)) {
            final Map<String, String> codeNameMap = userInfoDTOS.stream()
                    .collect(Collectors.toMap(UserInfoDTO::getCode, UserInfoDTO::getNickname));
            for (BillApprovalHistoryPO billApprovalHistoryPO : byBill) {
                final String userCode = billApprovalHistoryPO.getUserCode();
                final String name = codeNameMap.get(userCode);
                billApprovalHistoryPO.setUserName(name);
                final String sourceUserCode = billApprovalHistoryPO.getSourceUserCode();
                if (!Strings.isNullOrEmpty(sourceUserCode)) {
                    billApprovalHistoryPO.setSourceUserName(codeNameMap.get(sourceUserCode));
                }
                final String targetUserCode = billApprovalHistoryPO.getTargetUserCode();
                if (!Strings.isNullOrEmpty(targetUserCode)) {
                    billApprovalHistoryPO.setTargetUserName(codeNameMap.get(targetUserCode));
                }
                if (billApprovalHistoryPO.getTaskType()
                        .compareTo(BillTaskType.SKIP.getValue()) == 0) {
                    billApprovalHistoryPO.setUserName(Const.SKIP_OPTION);
                }
            }
        }
        final List<BillApprovalHistoryPO> result = byBill.stream()
                .sorted(Comparator.comparing(BillApprovalHistoryPO::getSort, (x, y) -> {
                    if (x <= y) {
                        return -1;
                    } else {
                        return 1;
                    }
                }))
                .collect(Collectors.toList());
        return billBasicConvert.billApprovalHistoryPOToVO(result);
    }

    /**
     * 撤回审批任务
     * <p>
     * 暂时只实现整体流程结束，并设置为草稿状态
     *
     * @param actionParam 审批操作参数
     */
    @Override
    public void recallFlow(BillActionParamDTO actionParam) {
        final long billId = actionParam.getBillId();
        final String taskId = actionParam.getTaskId();
        final String opinion = actionParam.getOpinion();
        final String userCode = actionParam.getUserCode();
        final ToaBillEntity bill = billService.getById(billId);
        if (bill == null) {
            throw new RbException(BillCode.BILL_NOT_FOUND);
        }
        if (bill.getStatus() != BillStatus.APPROVAL.getStatus()) {
            throw new RbException(APPROVAL_STATUS_ERROR);
        }
        billBpmnLogic.recall(bill, taskId, opinion, userCode);
    }

    private void refuseApproval(
            String taskId, String opinion, ToaBillEntity bill, String userCode, BillTaskEntity task
    ) {
        final Optional<ProcessNodeExtendEntity> nodeExtendOpt;
        final Long processId = bill.getProcessId();
        final String taskNodeKey = task.getTaskNodeKey();
        nodeExtendOpt = nodeExtendService.findByNodeIdAndProcessId(processId, taskNodeKey);
        if (nodeExtendOpt.isPresent()) {
            final ProcessNodeExtendEntity nodeExtend = nodeExtendOpt.get();
            final String linkType = nodeExtend.getLinkType();
            NodeLinkType nodeLinkType = NodeLinkType.valueOf(linkType);
            switch (nodeLinkType) {
                case submit:
                    throw new RbException(BillCode.SUMIT_STATUS_REFUSE);
                case create:
                    throw new RbException(BillCode.APPROVAL_STATUS_ERROR);
                case archive:
                    throw new RbException(BillCode.ARCHIVE_STATUS_REFUSE);
                case approvl:
                    final int dateline = DateTimeUtil.unixTime();
                    task.setNodeStatus(BillTaskStatus.REFUSE.getStatus());
                    task.setUpdateTime(LocalDateTime.now());
                    task.setOpinion(opinion);
                    task.setDateline(dateline);
                    task.setAction(BillAction.refuse.name());
                    //                    bill.setStatus(BillStatus.REFUSE.getStatus());
                    //                    bill.setUpdateTime(LocalDateTime.now());
                    //推送消息
                    List<BillTaskEntity> sends = Lists.newArrayList();
                    sends.add(task);
                    flowMsgLogic.sendMsg(sends);
                    billTaskService.updateById(task);
                    //                    billService.updateById(bill);
                    billReadRecordService.deleteByBillAndEmployeeId(bill.getId(), userCode);
                    billBpmnLogic.refuse(bill, taskId, opinion, userCode);
                    break;
                default:
                    break;
            }
        } else {
            throw new RbException(APPROVAL_STATUS_ERROR);
        }
    }

    @Override
    public boolean agreeIsGoOn(BillTaskEntity billTask) {
        final Long id = billTask.getId();
        final String taskId = billTask.getTaskId();
        final Long billId = billTask.getBillId();
        final Long approverId = billTask.getNodeApproverId();
        final ProcessNodeApproverEntity nodeApprover =
                nodeApproverService.getByIdExludDel(approverId);
        if (Objects.isNull(nodeApprover)) {
            //默认全部审批通过才能往下走
            final int percentage = 100;
            int countActive = billTaskService.findActiveExcludeSelf(billId, taskId, id);
            int total = billTaskService.findTotalCount(billId, taskId, billTask.getTaskType());
            final BigDecimal val1 = BigDecimal.valueOf(countActive + 1);
            final BigDecimal val2 = BigDecimal.valueOf(total);
            final BigDecimal val3 =
                    val1.divide(val2, 4, BigDecimal.ROUND_DOWN).multiply(BigDecimal.valueOf(100));
            final BigDecimal val4 = BigDecimal.valueOf(percentage);
            return val3.compareTo(val4) >= 0 ? true : false;
        }
        final String countersign = nodeApprover.getCountersign();
        final CountersignVO countersignVO = JSON.parseObject(countersign, CountersignVO.class);
        if (CountersignType.ONE_PASS.getVal() == countersignVO.getType()) {
            //一票通过，直接过
            return true;
        } else if (CountersignType.ONE_REJECT.getVal() == countersignVO.getType()) {
            //一票否决，判断审批节点是不是出了自己全部都审批通过了
            int countActive = billTaskService.findActiveExcludeSelf(billId, taskId, id);
            return countActive == 0 ? true : false;
        } else if (CountersignType.COUNT_PASS.getVal() == countersignVO.getType()) {
            final int count = countersignVO.getCount();
            int countActive = billTaskService.findActiveExcludeSelf(billId, taskId, id);
            return (countActive + 1) >= count ? true : false;
        } else if (CountersignType.PERCENTAGE_PASS.getVal() == countersignVO.getType()) {
            final int percentage = countersignVO.getCount();
            int countActive = billTaskService.findActiveExcludeSelf(billId, taskId, id);
            int total = billTaskService.findTotalCount(billId, taskId, billTask.getTaskType());
            final BigDecimal val1 = BigDecimal.valueOf(countActive + 1);
            final BigDecimal val2 = BigDecimal.valueOf(total);
            final BigDecimal val3 =
                    val1.divide(val2, 4, BigDecimal.ROUND_DOWN).multiply(BigDecimal.valueOf(100));
            final BigDecimal val4 = BigDecimal.valueOf(percentage);
            return val3.compareTo(val4) >= 0 ? true : false;
        }
        return false;
    }

    private Page<BillItemVO> toItemVOList(Page page, List<BillItemPO> billDatas, String userCode) {
        Page<BillItemVO> resultPage = new Page<>(page.getCurrent(), page.getSize());
        resultPage.setTotal(page.getTotal());
        if (CollectionUtil.isNotEmpty(billDatas)) {
            final Set<String> userCodes =
                    billDatas.stream().map(BillItemPO::getSender).collect(Collectors.toSet());
            final List<UserInfoDTO> userInfoDTOS = userCenterlogic.getUserByCodes(userCodes);
            final Map<String, String> codeNameMap = userInfoDTOS.stream()
                    .collect(Collectors.toMap(UserInfoDTO::getCode, a -> a.getNickname()));
            if (CollectionUtil.isNotEmpty(userInfoDTOS)) {
                for (BillItemPO billData : billDatas) {
                    final String sender = billData.getSender();
                    final String name = codeNameMap.get(sender);
                    if (!Strings.isNullOrEmpty(name)) {
                        billData.setSenderName(name);
                    }
                }
            }
            List<BillItemVO> billAppItemVOS;
            billAppItemVOS = Lists.newArrayListWithCapacity(billDatas.size());
            for (BillItemPO billItemDto : billDatas) {
                billAppItemVOS.add(billItemDto.toVO(userCode));
            }
            resultPage.setRecords(billAppItemVOS);
        }
        return resultPage;
    }

    private ToaBillEntity createBill(
            ProcessDetailPO processDetail, BillStatus billStatus, BillDataContext billDataValue,
            UserInfoDTO userInfoDTO
    ) {
        ToaBillEntity bill = new ToaBillEntity();
        bill.setId(billDataValue.getId());
        bill.setProcessId(processDetail.getId());
        bill.setCreationTime(LocalDateTime.now());
        final List<UserOrgDTO> orgs = userInfoDTO.getOrgs();
        if (CollectionUtil.isNotEmpty(orgs)) {
            bill.setDepartmentCode(orgs.get(0).getOrgCode());
        }
        bill.setAttachmentFlag(billDataValue.isAttachment() ? 1 : 0);

        final String title = billDataValue.getTitle();
        final String code = billDataValue.getCode();
        if (Strings.isNullOrEmpty(title)) {
            // 如果没有标题字段，则默认生成标题
            final String day = DateToStringUtil.yyyymmdashNow();
            final String processName = processDetail.getName();
            final String username = userInfoDTO.getNickname();
            String titleText = StrUtil.format("{}-{}-{}", processName, username, day);
            bill.setTitle(titleText);
        } else {
            bill.setTitle(title);
        }
        if (Strings.isNullOrEmpty(code)) {
            // 如果没有编码字段，则默认生成编码
            final String day = DateToStringUtil.yyyymmdashNow();
            final String processName = processDetail.getName();
            final String username = userInfoDTO.getNickname();
            // 生成默认流水号
            final String billCode = serialNumberLogic.dayPolling("bill_default_sn", 6);
            //            String codeText = StrUtil.format("{}-{}-{}-{}", processName, username, day, billCode);
            String codeText = StrUtil.format("{}", billCode);
            bill.setCode(codeText);
        } else {
            bill.setCode(code);
        }
        bill.setStatus(billStatus.getStatus());
        bill.setSender(userInfoDTO.getCode());
        return bill;
    }

    /**
     * 解析表单数据
     *
     * @param billId        审批单ID
     * @param processDetail 业务流程ID
     * @param formDataMap   表单数据
     * @return 解析后的表单数据
     */
    @Override
    public BillDataContext resolveFormData(
            long billId, ProcessDetailPO processDetail, Map<String, Object> formDataMap
    ) {

        long processId = processDetail.getId();

        final List<FormFieldPO> formFieldVOS = this.formFieldService.findVoByProcessId(processId);
        Map<String, FormFieldPO> formFieldVOMap = Maps.newHashMap();
        for (FormFieldPO formFieldVO : formFieldVOS) {
            formFieldVOMap.put(formFieldVO.getWidgetName(), formFieldVO);
        }
        final BillDataContext.BillDataContextBuilder dataValueBuilder = BillDataContext.builder();

        // fixed the billid zero if create process instance
        final long newBillId;
        if (billId <= 0) {
            newBillId = IdWorker.getId();
            dataValueBuilder.created(true);
        } else {
            newBillId = billId;
        }
        dataValueBuilder.id(newBillId);
        dataValueBuilder.processId(processId);
        dataValueBuilder.formDataMap(formDataMap);

        List<BillAssociatedVO> associateds = Lists.newArrayList();
        List<BillBizDataEntity> bizDataList = Lists.newArrayList();

        for (String widgetName : formDataMap.keySet()) {
            FormFieldPO formFieldVO = formFieldVOMap.get(widgetName);
            if (formFieldVO == null) {
                continue;
            }
            final String fieldType = formFieldVO.getType();
            if (Strings.isNullOrEmpty(fieldType)) {
                continue;
            }

            FormXtype formXtype = FormXtype.valueOf(fieldType);
            switch (formXtype) {
                case triggerselect: {
                    final Pair<List<BillAssociatedVO>, List<BillBizDataEntity>> selectVal;
                    selectVal = billItemLogic.formTriggerselectValue(formDataMap, formFieldVO,
                            newBillId);
                    associateds.addAll(selectVal.getKey());
                    bizDataList.addAll(selectVal.getValue());
                    break;
                }
                case imageupload:
                case fileupload: {
                    final Pair<String, String> uploadValue;
                    uploadValue = billItemLogic.formUploadValue(formDataMap, formFieldVO);
                    if (org.apache.commons.lang3.StringUtils.isNotEmpty(uploadValue.getKey())) {
                        dataValueBuilder.attachment(true);
                    }

                    break;
                }
                case biz: {
                    final Pair<String, String> bizPair;
                    bizPair = billItemLogic.formBizValue(formDataMap, formFieldVO);
                    String code = bizPair.getKey();
                    String title = bizPair.getValue();
                    if (org.apache.commons.lang3.StringUtils.isNotEmpty(code)) {
                        dataValueBuilder.code(code);
                    }
                    if (org.apache.commons.lang3.StringUtils.isNotEmpty(title)) {
                        dataValueBuilder.title(title);
                    }

                    break;
                }
                case detailgroup: {
                    // 处理明细字段数据
                    final String detailgroupName = formFieldVO.getWidgetName();
                    final JSONArray detailgroupDatas = (JSONArray) formDataMap.get(detailgroupName);
                    if (CollectionUtil.isEmpty(detailgroupDatas)) {
                        continue;
                    }
                    final List<FormFieldPO> detailFields = formFieldVO.getDetailFields();
                    if (CollectionUtil.isEmpty(detailFields)) {
                        continue;
                    }

                    final Triple<Boolean, List<BillAssociatedVO>, List<BillBizDataEntity>>
                            detailItemTriple;
                    detailItemTriple = billItemLogic.detailFormFileds(newBillId, detailgroupDatas,
                            detailFields);
                    final Boolean attachment = detailItemTriple.getLeft();
                    if (attachment) {
                        dataValueBuilder.attachment(true);
                    }
                    final List<BillAssociatedVO> associatedList = detailItemTriple.getMiddle();
                    if (CollectionUtil.isNotEmpty(associatedList)) {
                        associateds.addAll(associatedList);
                    }
                    final List<BillBizDataEntity> billBizDatas = detailItemTriple.getRight();
                    if (CollectionUtil.isNotEmpty(billBizDatas)) {
                        bizDataList.addAll(billBizDatas);
                    }
                    break;
                }
                default:
                    break;
            }
        }
        dataValueBuilder.associated(JSON.toJSONString(associateds));
        dataValueBuilder.bizDataList(bizDataList);
        return dataValueBuilder.build();
    }

    /**
     * 加签操作
     *
     * @param actionParam 审核参数
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void endorse(BillActionParamDTO actionParam) {
        final String endorseApprover = actionParam.getEndorseApprover();
        final String opinion = actionParam.getOpinion();
        final String taskId = actionParam.getTaskId();
        final long billId = actionParam.getBillId();
        final String userCode = actionParam.getUserCode();

        List<BillTaskEntity> billTaskEntities =
                billTaskService.findApprovingByBillAndTaskId(billId, taskId);
        final Set<String> collect = billTaskEntities.stream()
                .map(BillTaskEntity::getUserCode)
                .collect(Collectors.toSet());
        if (collect.contains(actionParam.getEndorseApprover())) {
            throw new RbException(ENDORSE_CANNOT_IN_NODE);
        }

        final Optional<BillTaskEntity> taskOpt;
        taskOpt = billBpmnLogic.findTaskBybillAndEmployeeAndTaskId(billId, taskId, userCode);
        if (!taskOpt.isPresent()) {
            throw new RbException(StringPool.EMPTY, ProcessCode.PROCESS_ACTIVITI_ERROR);
        }
        final BillTaskEntity task = taskOpt.get();
        final int taskNodeStatus = task.getNodeStatus();
        BillTaskStatus billTaskStatus = BillTaskStatus.valueTo(taskNodeStatus);
        switch (billTaskStatus) {
            case APPROVAL:
                // 更新提交的formdata
                final String formData = actionParam.getFormData();
                if (!Strings.isNullOrEmpty(
                        formData) && !org.apache.commons.lang3.StringUtils.equals("{}", formData)) {
                    this.billItemLogic.updateByFormDataByBill(billId, formData);
                }
                break;
            case AGREE:
            case REFUSE:
                throw new RbException(BillCode.BILL_TASK_HAS_APPROVED);
            default:
                throw new RbException(APPROVAL_STATUS_ERROR);

        }
        final BillTaskEntity newBillTask = BeanUtil.sourceToTarget(task, BillTaskEntity.class);
        task.setNodeStatus(BillTaskStatus.ENDORSE.getStatus());
        task.setOpinion(opinion);
        task.setDateline(DateTimeUtil.unixTime());
        billTaskService.upldate(task);
        newBillTask.setId(IdWorker.getId());
        newBillTask.setSourceTaskId(task.getId());
        newBillTask.setUserCode(endorseApprover);
        newBillTask.setSourceUserCode(userCode);
        newBillTask.setSort(System.currentTimeMillis());
        newBillTask.setTaskType(BillTaskType.ENDORSE.getValue());
        billTaskService.insert(newBillTask);
        List<BillTaskEntity> sends = Lists.newArrayList();
        sends.add(task);
        sends.add(newBillTask);
        flowMsgLogic.sendMsg(sends);
    }

    /**
     * 打回操作
     *
     * @param actionParam 审核参数
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void repulseFlow(BillActionParamDTO actionParam) {
        final String opinion = actionParam.getOpinion();
        final String taskId = actionParam.getTaskId();
        final long billId = actionParam.getBillId();
        final String userCode = actionParam.getUserCode();
        final String targetTaskId = actionParam.getTargetTaskId();
        final Optional<BillTaskEntity> taskOpt;
        taskOpt = billBpmnLogic.findTaskBybillAndEmployeeAndTaskId(billId, taskId, userCode);
        if (!taskOpt.isPresent()) {
            throw new RbException(StringPool.EMPTY, ProcessCode.PROCESS_ACTIVITI_ERROR);
        }
        final BillTaskEntity task = taskOpt.get();
        final int taskNodeStatus = task.getNodeStatus();
        BillTaskStatus billTaskStatus = BillTaskStatus.valueTo(taskNodeStatus);
        switch (billTaskStatus) {
            case APPROVAL:
                // 更新提交的formdata
                final String formData = actionParam.getFormData();
                if (!Strings.isNullOrEmpty(
                        formData) && !org.apache.commons.lang3.StringUtils.equals("{}", formData)) {
                    this.billItemLogic.updateByFormDataByBill(billId, formData);
                }
                break;
            case AGREE:
            case REFUSE:
                throw new RbException(BillCode.BILL_TASK_HAS_APPROVED);
            default:
                throw new RbException(APPROVAL_STATUS_ERROR);

        }

        final ToaBillEntity byId = billService.getById(billId);
        task.setNodeStatus(BillTaskStatus.REPULSE.getStatus());
        task.setOpinion(opinion);
        task.setDateline(DateTimeUtil.unixTime());
        billTaskService.upldate(task);
        final BillTaskEntity targetTask = billTaskService.getOne(
                Wrappers.lambdaQuery(BillTaskEntity.class).eq(BillTaskEntity::getId, targetTaskId));
        if (Objects.isNull(targetTask)) {
            throw new RbException(TARGET_TASK_NULL);
        }
        final String taskNodeKey = targetTask.getTaskNodeKey();
        final ProcessNodeExtendEntity extendEntity = nodeExtendService.getOne(
                Wrappers.lambdaQuery(ProcessNodeExtendEntity.class)
                        .eq(ProcessNodeExtendEntity::getProcessId, byId.getProcessId())
                        .eq(ProcessNodeExtendEntity::getNodeId, taskNodeKey));
        List<BillTaskEntity> sends = Lists.newArrayList();
        //退回需要删除当前节点审批中的数据
        billTaskService.remove(Wrappers.lambdaQuery(BillTaskEntity.class)
                .eq(BillTaskEntity::getBillId, billId)
                .eq(BillTaskEntity::getTaskNodeKey, task.getTaskNodeKey())
                .ne(BillTaskEntity::getId, task.getId()));
        if (!extendEntity.getLinkType().equals(NodeLinkType.create.name())) {
            billBpmnLogic.returnToTargetTask(task, targetTask, userCode, opinion,
                    actionParam.getNextApprover());
        } else {
            /**
             *表示是退回到发起节点需要进行操作需要找到当前审批的最新的创建节点，然后找到任务taskId和用户然后重新创建一个节点任务
             */
            billService.update(Wrappers.lambdaUpdate(ToaBillEntity.class)
                    .set(ToaBillEntity::getStatus, BillStatus.REPULSE.getStatus())
                    .eq(ToaBillEntity::getId, billId));
            BillTaskEntity createTask = billTaskService.findCreateTaskByBill(billId);
            if (Objects.isNull(createTask)) {
                throw new RbException(StringPool.EMPTY, ProcessCode.PROCESS_ACTIVITI_ERROR);
            }
            final BillTaskEntity newBillTask =
                    BeanUtil.sourceToTarget(createTask, BillTaskEntity.class);
            newBillTask.setId(IdWorker.getId());
            newBillTask.setSourceTaskId(task.getId());
            newBillTask.setSourceUserCode(userCode);
            newBillTask.setSort(System.currentTimeMillis());
            newBillTask.setDateline(null);
            newBillTask.setTaskType(BillTaskType.DEFAULT.getValue());
            newBillTask.setNodeStatus(BillTaskStatus.REFUSE_FILL_IN.getStatus());
            billTaskService.insert(newBillTask);
            sends.add(newBillTask);
            BillRepulseEvent billRefuseEvent = new BillRepulseEvent();
            billRefuseEvent.setBillId(billId);
            billRefuseEvent.setProcessId(byId.getProcessId());
            eventBus.post(billRefuseEvent);
        }
        sends.add(task);
        flowMsgLogic.sendMsg(sends);
    }

    /**
     * 移交操作
     *
     * @param billId   单据id
     * @param taskId   任务id
     * @param turnUser 移交用户
     */
    @Override
    public void turnUser(
            long billId, String taskId, String turnUser, String userCode, String opinion
    ) {
        List<BillTaskEntity> billTaskEntities =
                billTaskService.findApprovingByBillAndTaskId(billId, taskId);
        Set<String> collect = billTaskEntities.stream()
                .map(BillTaskEntity::getUserCode)
                .collect(Collectors.toSet());
        // 更新移交
        final List<String> split = StrUtil.split(turnUser, ',');
        final Set<String> hashSet = new HashSet(split);
        collect.retainAll(hashSet);
        if (CollectionUtil.isNotEmpty(collect)) {
            throw new RbException(TURN_CANNOT_IN_NODE);
        }
        final Optional<BillTaskEntity> taskOpt;
        taskOpt = billBpmnLogic.findTaskBybillAndEmployeeAndTaskId(billId, taskId, userCode);
        if (!taskOpt.isPresent()) {
            throw new RbException(StringPool.EMPTY, ProcessCode.PROCESS_ACTIVITI_ERROR);
        }
        final BillTaskEntity task = taskOpt.get();
        final int taskNodeStatus = task.getNodeStatus();
        BillTaskStatus billTaskStatus = BillTaskStatus.valueTo(taskNodeStatus);
        switch (billTaskStatus) {
            case APPROVAL:

                List<BillTaskEntity> insertLists = Lists.newArrayList();
                for (String s : hashSet) {
                    final BillTaskEntity turnTask =
                            BeanUtil.sourceToTarget(task, BillTaskEntity.class);
                    turnTask.setSourceTaskId(task.getId());
                    turnTask.setSourceUserCode(userCode);
                    turnTask.setTaskType(BillTaskType.TURN.getValue());
                    turnTask.setUserCode(s);
                    turnTask.setId(null);
                    insertLists.add(turnTask);
                }
                billTaskService.saveBatch(insertLists);
                task.setNodeStatus(BillTaskStatus.TURN.getStatus());
                task.setOpinion(Strings.isNullOrEmpty(opinion) ? "移交" : opinion);
                task.setDateline(DateTimeUtil.unixTime());
                billTaskService.upldate(task);
                List<BillTaskEntity> sends = Lists.newArrayList();
                sends.addAll(insertLists);
                sends.add(task);
                flowMsgLogic.sendMsg(sends);
                break;
            case AGREE:
            case REFUSE:
                throw new RbException(BillCode.BILL_TASK_HAS_APPROVED);
            default:
                throw new RbException(APPROVAL_STATUS_ERROR);

        }
    }

    /**
     * 手机端创建审批单
     *
     * @param processId 业务流程主键
     * @return 审批单数据信息
     */
    @Override
    public BillDetailVO<List<FormFieldVO>> createByApp(long processId) {
        ProcessDetailDTO process = checkProcess(processId);
        final List<FormFieldVO> fieldVOS =
                formBasicConvert.FormFieldPOToVO(formFieldService.findVoByProcessId(processId));
        List<BillOpinionVO> opinionVOS = Lists.newArrayList();
        String firstNodeId = nodeExtendService.findTaskNodeIdByProcessAndLinkType(processId,
                NodeLinkType.create);
        // 获取授权信息
        final List<FormPermissionVO> permissionVOS;
        permissionVOS = billBpmnLogic.nodeFieldPermission(processId, firstNodeId);
        // 获取标题字段
        final String userCode = loginUserHolder.getUserCode();
        final UserInfoDTO userInfoByCode = userCenterlogic.getUserInfoByCode(userCode);
        final String title = billTitleLogic.getTitle(processId, userInfoByCode.getNickname());
        Map<String, Object> formData = bizFormData(process, userInfoByCode, title);
        final List<String> btns = billBtnLogic.findBtnsOnCreateBill(process);
        return BillDetailVO.<List<FormFieldVO>>builder()
                .form(fieldVOS)
                .processId(processId)
                .formData(formData)
                .opinions(opinionVOS)
                .permission(permissionVOS)
                .btns(btns)
                .mode("create")
                .build();
    }

    /**
     * 表单验证
     *
     * @param processId    流程id
     * @param billId       审批单id
     * @param formDataJson 表单数据
     * @param userCode     用户编号
     * @return 验证结果
     */
    @Override
    public ValidationResultDTO validation(
            long processId, long billId, String formDataJson, String userCode
    ) {
        final Map<String, Object> dataMap =
                JSON.parseObject(formDataJson, FastJsonType.MAP_OBJECT_TR);
        final BillDataContext billDataValue;
        final ProcessDetailPO processDetail = this.processService.findDetailById(processId);
        billDataValue = this.resolveFormDataByValidation(billId, processDetail, dataMap);
        final BillValidationLogic validationService = getValidationService(processDetail.getId());
        return validataionWithResult(billDataValue, userCode, validationService);
    }

    /**
     * 获取当前节点的包含条件,获取当前节点的所有包含条件，没有根据审批人进行过滤，需要注意 如果需要使用，只能设置一个条件
     *
     * @param processId 流程编号
     * @param billId    审批单id
     * @param taskId    节点任务编号
     * @return 节点条件
     */
    @Override
    public List<String> getNodeCondition(long processId, long billId, String taskId) {
        final List<BillTaskEntity> list = billTaskService.list(
                Wrappers.lambdaQuery(BillTaskEntity.class)
                        .eq(BillTaskEntity::getBillId, billId)
                        .eq(BillTaskEntity::getTaskId, taskId));
        final Set<String> nodeKeys =
                list.stream().map(BillTaskEntity::getTaskNodeKey).collect(Collectors.toSet());
        if (CollectionUtil.isEmpty(nodeKeys)) {
            return Collections.emptyList();
        }
        final List<ProcessNodeApproverEntity> list1 = nodeApproverService.list(
                Wrappers.lambdaQuery(ProcessNodeApproverEntity.class)
                        .eq(ProcessNodeApproverEntity::getProcessId, processId)
                        .in(ProcessNodeApproverEntity::getNodeId, nodeKeys));
        final List<String> params = list1.stream()
                .filter(a -> !Strings.isNullOrEmpty(a.getExpress()) && a.getExpress()
                        .indexOf("implication") != -1)
                .map(ProcessNodeApproverEntity::getExpressParams)
                .collect(Collectors.toList());
        List<String> result = Lists.newArrayList();
        for (String param : params) {
            final JSONObject jsonObject = JSON.parseObject(param);
            for (String s : jsonObject.keySet()) {
                if (s.startsWith("fd_")) {
                    final JSONArray jsonArray = jsonObject.getJSONArray(s);
                    for (Object o : jsonArray) {
                        result.add(o.toString());
                    }

                }
            }
        }
        return result;
    }

    /**
     * 获取待我审批数量
     *
     * @return 待我审批数量
     */
    @Override
    public String findTodoSize() {
        List<Integer> statusList =
                Lists.newArrayList(BillStatus.APPROVAL.getStatus(), BillStatus.REFUSE.getStatus());
        final String userCode = loginUserHolder.getUserCode();
        final String todoSize = this.billService.findTodoSizeByStatus(userCode, statusList);
        return todoSize;
    }

    @Override
    public Pair<List<BillItemVO>, Long> findAllByQuery(
            Integer pageNo, Integer pageSize, DraftBillQuery query
    ) {
        Page page = new Page(pageNo, pageSize);
        final List<BillItemPO> billDatas = this.billService.findAllByQuery(page, query);
        final Page<BillItemVO> billItemVOPage = toItemVOList(page, billDatas, null);
        return Pair.of(billItemVOPage.getRecords(), billItemVOPage.getTotal());
    }

    private ValidationResultDTO validataionWithResult(
            BillDataContext billDataValue, String userCode, BillValidationLogic validationService
    ) {

        if (null != validationService) {
            return validationService.validation(billDataValue, userCode);
        } else {
            ValidationResultDTO validation = new ValidationResultDTO();
            validation.setAllowGoOnFlag(true);
            validation.setPassedFlag(true);
            return validation;
        }
    }

    private BillValidationLogic getValidationService(long processId) {
        FormValidationEntity formValidation = formValidationService.findByProcessId(processId);
        if (null == formValidation) {
            return null;
        }
        String exp = formValidation.getExpression();
        return SpringContextHolder.getBean(exp);
    }

    @Transactional(readOnly = true, rollbackFor = Exception.class)
    public BillDataContext resolveFormDataByValidation(
            long billId, ProcessDetailPO processDetail, Map<String, Object> formDataMap
    ) {
        long processId = processDetail.getId();

        final List<FormFieldPO> formFieldVOS = this.formFieldService.findVoByProcessId(processId);
        Map<String, FormFieldPO> formFieldVOMap = Maps.newHashMap();
        for (FormFieldPO formFieldVO : formFieldVOS) {
            formFieldVOMap.put(formFieldVO.getWidgetName(), formFieldVO);
        }
        final BillDataContext.BillDataContextBuilder dataValueBuilder = BillDataContext.builder();

        // fixed the billid zero if create process instance
        final long newBillId;
        if (billId <= 0) {
            newBillId = IdWorker.getId();
            dataValueBuilder.created(true);
        } else {
            newBillId = billId;
        }
        dataValueBuilder.id(newBillId);
        dataValueBuilder.processId(processId);
        dataValueBuilder.formDataMap(formDataMap);


        for (String widgetName : formDataMap.keySet()) {
            FormFieldPO formFieldVO = formFieldVOMap.get(widgetName);
            if (formFieldVO == null) {
                continue;
            }
            final String fieldType = formFieldVO.getType();
            if (Strings.isNullOrEmpty(fieldType)) {
                continue;
            }

            FormXtype formXtype = FormXtype.valueOf(fieldType);
            switch (formXtype) {
                case imageupload:
                case fileupload: {
                    final Pair<String, String> uploadValue;
                    uploadValue = billItemLogic.formUploadValue(formDataMap, formFieldVO);
                    if (org.apache.commons.lang3.StringUtils.isNotEmpty(uploadValue.getKey())) {
                        dataValueBuilder.attachment(true);
                    }

                    break;
                }
                case biz: {
                    final Pair<String, String> bizPair;
                    bizPair = billItemLogic.formBizValue(formDataMap, formFieldVO);
                    String code = bizPair.getKey();
                    String title = bizPair.getValue();
                    if (org.apache.commons.lang3.StringUtils.isNotEmpty(title)) {
                        dataValueBuilder.title(title);
                    }

                    if (org.apache.commons.lang3.StringUtils.isNotEmpty(code)) {
                        dataValueBuilder.code(code);
                    }
                    break;
                }
                case detailgroup: {
                    // 处理明细字段数据
                    final String detailgroupName = formFieldVO.getWidgetName();
                    final JSONArray detailgroupDatas = (JSONArray) formDataMap.get(detailgroupName);
                    if (CollectionUtil.isEmpty(detailgroupDatas)) {
                        continue;
                    }
                    final List<FormFieldPO> detailFields = formFieldVO.getDetailFields();
                    if (CollectionUtil.isEmpty(detailFields)) {
                        continue;
                    }

                    final Triple<Boolean, List<BillAssociatedVO>, List<BillBizDataEntity>>
                            detailItemTriple;
                    detailItemTriple = billItemLogic.detailFormFileds(newBillId, detailgroupDatas,
                            detailFields);
                    final Boolean attachment = detailItemTriple.getLeft();
                    if (attachment) {
                        dataValueBuilder.attachment(true);
                    }

                    break;
                }
                default:
                    break;
            }
        }
        return dataValueBuilder.build();
    }

    /**
     * 获取审批意见信息以及时间等信息
     *
     * @param bill 审批单
     * @return 审批信息
     */
    private List<BillOpinionVO> billOpinions(ToaBillEntity bill) {
        long processId = MoreObjects.firstNonNull(bill.getProcessId(), 0L);
        final List<BillOpinionVO> opinionVOS = Lists.newArrayList();
        final List<ProcessNodeExtendEntity> taskNodes =
                nodeExtendService.findTaskNodeByProcess(processId);
        if (CollectionUtil.isNotEmpty(taskNodes)) {
            for (ProcessNodeExtendEntity taskNode : taskNodes) {
                final String linkType = taskNode.getLinkType();
                if (org.apache.commons.lang3.StringUtils.equals(linkType,
                        NodeLinkType.approvl.name())) {
                    BillOpinionVO billOpinionVO = new BillOpinionVO();
                    billOpinionVO.setTitle(taskNode.getNodeName());
                    opinionVOS.add(billOpinionVO);
                }
            }
        }
        return opinionVOS;
    }

    private <T> BillDetailVO.BillDetailVOBuilder<T> billDetailBuilder(
            BillDataJsonEntity billDataJson, ToaBillEntity bill
    ) {
        return billDetailBuilder(billDataJson, bill, StringPool.EMPTY);
    }

    private <T> BillDetailVO.BillDetailVOBuilder<T> billDetailBuilder(
            BillDataJsonEntity billDataJson, ToaBillEntity bill, String page
    ) {
        long billId = bill.getId();
        long processId = bill.getProcessId();
        final String userCode = loginUserHolder.getUserCode();
        final String sender = bill.getSender();
        if (!sender.equals(userCode)) {
            // 不是自己发起的，记录读取
            billReadRecordService.readBillByUserCode(billId, userCode);
        }
        final int dbBillStatus = MoreObjects.firstNonNull(bill.getStatus(), 0);
        final BillStatus billStatus = BillStatus.valueTo(dbBillStatus);

        final BillDetailVO.BillDetailVOBuilder<T> detailBuilder = BillDetailVO.<T>builder();
        final List<String> btns;
        final List<FormPermissionVO> permissions;
        BillTaskEntity billTask = null;
        List<BillTaskEntity> tasks = billTaskService.findTaskByBillAndUserCode(billId, userCode);
        for (BillTaskEntity task : tasks) {
            BillTaskStatus taskStatus = BillTaskStatus.valueTo(task.getNodeStatus());
            if (taskStatus == BillTaskStatus.APPROVAL) {
                billTask = task;
            }
        }
        if (Objects.isNull(billTask)) {
            if (CollectionUtil.isNotEmpty(tasks)) {
                billTask = tasks.get(0);
            }
        }
        if (!Objects.isNull(billTask)) {
            btns = billBtnLogic.findBtnsOnTaskAction(userCode, bill, billTask);
            final String taskId = MoreObjects.firstNonNull(billTask.getTaskId(), EMPTY);
            detailBuilder.taskId(taskId);

            final int nodeStatus = billTask.getNodeStatus();
            BillTaskStatus taskStatus = BillTaskStatus.valueTo(nodeStatus);
            switch (taskStatus) {
                case CANCEL:
                    // 已撤销了
                    permissions = billBpmnLogic.findPermissionByProcessStartNode(processId);
                    break;
                case AGREE:
                case REFUSE:
                case APPROVAL:
                case ARCHIVED:
                case APPLY_CANCEL:
                case FILL_IN:
                case OTHER_APPROVAL: {
                    final String taskNodeKey = billTask.getTaskNodeKey();
                    permissions = billBpmnLogic.nodeFieldPermission(processId, taskNodeKey);
                    if (CollectionUtil.isNotEmpty(permissions)) {
                        if (billStatus == BillStatus.COMPLETE) {
                            for (FormPermissionVO permission : permissions) {
                                permission.setEdit(false);
                            }
                        } else if (!Strings.isNullOrEmpty(
                                page) && org.apache.commons.lang3.StringUtils.equalsAny(page, "cc",
                                "approved")) {
                            // 来自我发起的列表和抄送我的列表，这个时候，所有的按钮权限应该都是不可编辑的
                            for (FormPermissionVO permission : permissions) {
                                permission.setEdit(false);
                            }
                        }
                    }
                    break;
                }
                case REFUSE_FILL_IN:
                    permissions = billBpmnLogic.findPermissionByProcessStartNode(processId);
                    if (CollectionUtil.isNotEmpty(
                            permissions) && billStatus == BillStatus.COMPLETE) {
                        for (FormPermissionVO permission : permissions) {
                            permission.setEdit(false);
                        }
                    }
                    break;
                default:
                    permissions = Collections.emptyList();
            }

        } else {
            btns = billBtnLogic.findBtnsOnViewBill(userCode, bill);
            detailBuilder.taskId(EMPTY);
            permissions = billBpmnLogic.findPermissionByBill(bill, userCode);
            if (CollectionUtil.isNotEmpty(permissions) && billStatus == BillStatus.COMPLETE) {
                for (FormPermissionVO permission : permissions) {
                    permission.setEdit(false);
                }
            }
        }
        Map<String, Object> formData =
                JSON.parseObject(billDataJson.getFormData(), FastJsonType.MAP_OBJECT_TR);
        String title = StringPool.EMPTY;
        if (!Strings.isNullOrEmpty(bill.getTitle())) {
            title = bill.getTitle();
        }
        /**
         * 需要对提交按钮进行控制如果不允许提交，则把提交按钮删除
         */
        final ToaProcessEntity byId = processService.getById(bill.getProcessId());
        final Integer assistant = byId.getAssistant();
        if (assistant == 0) {
            btns.remove(BillBtnConst.BTN_SUBMIT);
        }
        /**
         * 需要对按钮进行过滤
         */
        List<String> newBtns = billBtnLogic.filterByNode(billTask, btns);
        detailBuilder.title(title)
                .formData(formData)
                .processId(processId)
                .billId(billId)
                .permission(permissions)
                .btns(newBtns);
        return detailBuilder;
    }

    /**
     * 检查业务流程是否存在以及和业务流程状态是否是正在使用
     *
     * @param processId 业务流程ID
     * @return 业务流程信息，如果状态或者业务流程不存在，则抛出异常
     */
    private ProcessDetailDTO checkProcess(long processId) {
        final ProcessDetailPO process = this.processService.findDetailById(processId);
        if (process == null) {
            throw new RbException(StringPool.EMPTY, ProcessCode.BILL_SAVE_PROCESS_NIL);
        }

        if (process.getStatus() != ProcessConst.PROCESS_STATUS_NORMAL) {
            throw new RbException(StringPool.EMPTY, ProcessCode.BILL_PROCESS_NOT_USED);
        }
        return billBasicConvert.billPOToDTO(process);
    }

    /**
     * 根据业务流程信息查找表单中的业务字段，来获取业务字段的数据信息
     *
     * @param process 业务流程信息
     * @param title   审批标题
     * @return 封装后的表单字段信息
     */
    private Map<String, Object> bizFormData(
            ProcessDetailDTO process, UserInfoDTO userInfoDTO, String title
    ) {
        final long processId = process.getId();
        final long processCodeId = Objects.isNull(process.getCodeId()) ? 0 : process.getCodeId();
        final List<FormFieldEntity> bizFields =
                this.formFieldService.findBizFiled(processId, FormXtype.biz);
        if (CollectionUtil.isEmpty(bizFields)) {
            return Collections.emptyMap();
        }
        Map<String, Object> formData = Maps.newHashMap();
        for (FormFieldEntity bizField : bizFields) {
            String bizTypeStr = bizField.getBizType();
            if (Strings.isNullOrEmpty(bizTypeStr)) {
                continue;
            }
            BizType bizType = BizType.valueOf(bizTypeStr);
            final String widgetName = bizField.getWidgetName();
            switch (bizType) {
                case billTitle:
                    // 获取标题字段
                    formData.put(widgetName, title);
                    break;
                case loginUser:
                    if (!Objects.isNull(userInfoDTO)) {
                        formData.put(widgetName, userInfoDTO.getNickname());
                    } else {
                        formData.put(widgetName, "无");
                    }

                    break;
                case department:
                    String organizationName = EMPTY;
                    if (!Objects.isNull(userInfoDTO)) {
                        final List<UserOrgDTO> orgs = userInfoDTO.getOrgs();
                        if (CollectionUtil.isNotEmpty(orgs)) {
                            final List<String> orgNames = orgs.stream()
                                    .map(UserOrgDTO::getOrgName)
                                    .collect(Collectors.toList());
                            organizationName = StrUtil.join(",", orgNames);
                        }
                    }
                    formData.put(widgetName, organizationName);
                    break;
                case billCode:
                    final String billCode = serialNumberLogic.dayPolling("bill_default_sn", 6);
                    log.debug("the bill code is {}", billCode);
                    formData.put(widgetName, billCode);
                    break;
                default:
                    break;

            }
        }
        return formData;
    }

    @Override
    public List<ProcessTypeVO> findTodoCateSize() {
        LambdaQueryWrapper<ProcessTypeEntity> wrapper =
                Wrappers.lambdaQuery(ProcessTypeEntity.class);

        List<ProcessTypeEntity> processTypes = this.processTypeService.list(wrapper);
        if (CollectionUtil.isNotEmpty(processTypes)) {
            int processTypeSize = processTypes.size();
            List<ProcessTypeVO> types = Lists.newArrayListWithCapacity(processTypeSize);
            List<Integer> statusList = Lists.newArrayList(
                    new Integer[]{BillStatus.APPROVAL.getStatus(), BillStatus.REFUSE.getStatus()});
            String userCode = this.loginUserHolder.getUserCode();
            List<ProcessGridPO> todoCateSize =
                    this.billService.findTodoCateSize(userCode, statusList);
            List<ProcessVO> processVOS = this.processBasicConvert.processGridPOToVO(todoCateSize);
            Map<Long, List<ProcessVO>> collect =
                    (Map) processVOS.stream().collect(Collectors.groupingBy(ProcessVO::getTypeId));

            ProcessTypeVO processTypeVO;
            for (Iterator var10 = processTypes.iterator(); var10.hasNext(); types.add(
                    processTypeVO)) {
                ProcessTypeEntity processType = (ProcessTypeEntity) var10.next();
                Long id = processType.getId();
                List<ProcessVO> processVOS1 = (List) collect.get(id);
                processTypeVO = new ProcessTypeVO();
                processTypeVO.setName(processType.getName());
                processTypeVO.setId(processType.getId());
                processTypeVO.setFlows(Lists.newArrayList());
                if (CollectionUtil.isNotEmpty(processVOS1)) {
                    processTypeVO.setFlows(processVOS1);
                }
            }

            return types;
        } else {
            return Collections.emptyList();
        }
    }
}

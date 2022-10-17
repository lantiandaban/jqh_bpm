

package com.srm.bpm.logic.service.impl;

import com.google.common.base.MoreObjects;
import com.google.common.base.Preconditions;
import com.google.common.base.Strings;
import com.google.common.collect.Maps;
import com.google.common.io.Files;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.bpm.facde.dto.BaseProcessDTO;
import com.srm.bpm.facde.dto.ProcessGridDTO;
import com.srm.bpm.infra.entity.ProcessBillTitleEntity;
import com.srm.bpm.infra.entity.ProcessDesingerEntity;
import com.srm.bpm.infra.entity.ToaFormEntity;
import com.srm.bpm.infra.entity.ToaProcessEntity;
import com.srm.bpm.infra.po.ProcessGridPO;
import com.srm.bpm.infra.service.FormSettingService;
import com.srm.bpm.infra.service.ProcessBillTitleService;
import com.srm.bpm.infra.service.ProcessDesingerService;
import com.srm.bpm.infra.service.ToaFormService;
import com.srm.bpm.infra.service.ToaProcessService;
import com.srm.bpm.logic.constant.ProcessCode;
import com.srm.bpm.logic.constant.ProcessConst;
import com.srm.bpm.logic.constant.StringPool;
import com.srm.bpm.logic.converts.ProcessBasicConvert;
import com.srm.bpm.logic.service.ProcessFlowLogic;
import com.srm.bpm.logic.util.BpmnXmlUtil;
import com.srm.bpm.logic.vo.ProcessDesingerVO;
import com.srm.bpm.logic.vo.ProcessNodeVO;
import com.srm.config.BpmConfig;
import com.srm.config.TenantProperties;
import com.srm.common.data.exception.RbException;
import com.srm.common.util.datetime.DateTimeUtil;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.DeploymentBuilder;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.repository.ProcessDefinitionQuery;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.FileCopyUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import cn.hutool.core.lang.Pair;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static com.srm.bpm.logic.error.BillCode.PROCESS_PUBLISHING_ERROR;

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
public class ProcessFlowLogicImpl implements ProcessFlowLogic {
    private final ToaProcessService toaProcessService;
    private final ToaFormService toaFormService;
    private final ProcessDesingerService processDesingerService;
    private final RepositoryService repositoryService;
    private final BpmConfig bpmConfig;
    private final TenantProperties tenantProperties;
    private final ProcessBillTitleService processBillTitleService;
    private final FormSettingService formSettingService;
    private final ProcessBasicConvert processBasicConvert;

    /**
     * 分页查询流程信息
     *
     * @param pageNo   当前页
     * @param pageSize 页容量
     * @return 数据和总数
     */
    @Override
    public Pair<List<ProcessGridDTO>, Long> getProcessFlowByPage(Integer pageNo, Integer pageSize,
                                                                 Map<String, Object> params, String bloc) {
        final Page page = new Page(pageNo, pageSize);
        Map<String, Object> parm = Maps.newHashMap();
        if (!Objects.isNull(params.get("q"))) {
            final String text = (String) params.get("q");
            String decode="{}";
            try {
                decode = URLDecoder.decode(text,"UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            final JSONObject q = JSON.parseObject(decode);
            for (String s : q.keySet()) {
                parm.put(s, q.get(s));
            }
        }
        List<ProcessGridPO> list = toaProcessService.selectByPaging(page, parm, bloc, tenantProperties.getEnable());
        final List<ProcessGridDTO> gridDTOS = processBasicConvert.processGridPOToDTO(list);
        return new Pair<>(gridDTOS, page.getTotal());
    }

    /**
     * 保存流程基本信息
     *
     * @param process 流程对象
     * @return 是否成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean saveProcess(BaseProcessDTO process, String bloc) {
        final ToaProcessEntity processEntity = processBasicConvert.baseProcessDTOToEntity(process);
        if (tenantProperties.getEnable()) {
            processEntity.setBlocCode(bloc);
        }
        long processId = MoreObjects.firstNonNull(process.getId(), 0L);
        final LocalDateTime now = LocalDateTime.now();
        boolean state;
        if (processId > 0) {
            processEntity.setUpdateTime(now);
            // 编辑
            state = toaProcessService.upldate(processEntity);
        } else {
            processEntity.setId(IdWorker.getId());
            processEntity.setCode(IdWorker.get32UUID());
            processEntity.setCreationTime(now);
            processEntity.setStatus(ProcessConst.PROCESS_STATUS_DRAFT);
            state = toaProcessService.insert(processEntity);
            if (state) {
                ToaFormEntity form = new ToaFormEntity();
                form.setProcessId(process.getId());
                form.setProcessFlag(1);
                form.setName(process.getName());
                form.setCreationTime(now);
                final String dateStr = DateTimeUtil.format(now, "yyyyMMdd") + RandomUtil.randomNumbers(4);
                form.setCode(dateStr);
                // 新增form表单
                state = toaFormService.insert(form);
            }
        }
        if (!state) {
            throw new RbException("update process has error!");
        }
        final Optional<ProcessBillTitleEntity> unique =
                processBillTitleService.unique(Wrappers.lambdaQuery(ProcessBillTitleEntity.class).eq(ProcessBillTitleEntity::getProcessId, processEntity.getId()));
        ProcessBillTitleEntity billTitle;
        if (unique.isPresent()) {
            billTitle = unique.get();
            billTitle.setCreationTime(LocalDateTime.now());
        } else {
            billTitle = new ProcessBillTitleEntity();
            billTitle.setUpdateTime(LocalDateTime.now());
            billTitle.setProcessId(processEntity.getId());
        }
        billTitle.setTimePattern("yyyy-MM-dd");
        billTitle.setTimeFlag(1);
        billTitle.setProcessTitle(1);
        billTitle.setProcessType(0);
        billTitle.setCreaterFlag(1);
        billTitle.setFormula("#{processName}-#{processCreater}-#{today}");
        processBillTitleService.saveOrUpdate(billTitle);
        return state;
    }

    /**
     * 删除流程信息
     *
     * @param processId 流程id
     * @return 是否成功
     */
    @Override
    public boolean removeProcess(long processId) {
        return toaProcessService.removeById(processId);
    }

    /**
     * 撤回流程
     *
     * @param processId 流程
     * @return 删除结果
     */
    @Override
    public boolean cancelProcess(long processId) {
        return updateStatus(processId, ProcessConst.PROCESS_STATUS_DRAFT);
    }

    /**
     * 启用流程
     *
     * @param processId 流程
     * @return 是否成功
     */
    @Override
    public boolean enableProcess(long processId) {
        return updateStatus(processId, ProcessConst.PROCESS_STATUS_NORMAL);
    }

    /**
     * 禁用流程
     *
     * @param processId 流程
     * @return 禁用结果
     */
    @Override
    public boolean disableProcess(long processId) {
        return updateStatus(processId, ProcessConst.PROCESS_STATUS_DISABLE);
    }

    /**
     * 发布流程
     *
     * @param processId 流程id
     * @return 是否成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean releaseProcess(long processId) {
        final ToaProcessEntity process = toaProcessService.getById(processId);
        Preconditions.checkNotNull(process);
        final ProcessDesingerEntity processDesinger =
                this.processDesingerService.getOne(Wrappers.lambdaQuery(ProcessDesingerEntity.class)
                        .eq(ProcessDesingerEntity::getProcessId, processId));
        final String processXml = processDesinger.getProcessXml();
        // 解析XML
        final String desingerJson = processDesinger.getDesingerJson();
        final ProcessDesingerVO desingerVO = JSON.parseObject(desingerJson, ProcessDesingerVO.class);
        final List<ProcessNodeVO> nodeSettings = desingerVO.getNodeSettings();
        final String bpmnXML = BpmnXmlUtil.destBpmnXml(processXml, processId, nodeSettings);
        final String processKey = StrUtil.format(ProcessConst.PROCESS_KEY_FORMAT, processId);

        final DeploymentBuilder deploymentBuilder = repositoryService.createDeployment();
        // FUCK 这个  .bpmn20.xml 或者 bpmn 必须加，否则 无法正确的发布成功 sogyf 出坑 2017-07-24
        final Deployment deployment = deploymentBuilder
                .addString(processKey + ".bpmn", bpmnXML)
                .name(processKey).deploy();
        // 验证是否部署成功
        if (deployment == null) {
            throw new RbException(StringPool.EMPTY, ProcessCode.DEPLOYEE_FAILURE);
        }
        final ProcessDefinitionQuery pdq = repositoryService.createProcessDefinitionQuery();
        long count = pdq.processDefinitionKey(processKey).deploymentId(deployment.getId()).count();
        if (count > 0) {
            final ProcessDefinition processDefinition =
                    this.repositoryService.createProcessDefinitionQuery()
                            .processDefinitionKey(processKey)
                            .latestVersion()
                            .singleResult();


            // 发布图片
            String diagramName = processDefinition.getDiagramResourceName();
            int version = processDefinition.getVersion();

            String diagramRelativeFilePath = StrUtil.format(ProcessConst.DIAGRAM_PATH, processKey, version,
                    diagramName);

            String diagramFilePath = bpmConfig.getFilePath() + File.separator + diagramRelativeFilePath;

            exportDiagramToFile(processDefinition, diagramFilePath);
            final LocalDateTime now = LocalDateTime.now();
            process.setUpdateTime(now);
            process.setFlowId(processKey);
            process.setBpmVersion(version);
            process.setDiagramPath(diagramRelativeFilePath);
            process.setStatus(ProcessConst.PROCESS_STATUS_NORMAL);
            final boolean updateState = this.toaProcessService.upldate(process);
            if (!updateState) {
                throw new RbException(PROCESS_PUBLISHING_ERROR);
            }
            return true;
        } else {
            // 部署失败
            throw new RbException(StringPool.EMPTY, ProcessCode.DEPLOYEE_FAILURE);
        }
    }

    /**
     * 开始使用流程
     *
     * @param processId 流程id
     * @return 是否成功
     */
    @Override
    public boolean openProcess(long processId) {
        return updateCLoseFlag(processId, false);
    }

    private boolean updateCLoseFlag(long processId, boolean closeFlag) {
        final ToaProcessEntity byId = toaProcessService.getById(processId);
        byId.setCloseFlag(closeFlag ? 1 : 0);
        return toaProcessService.upldate(byId);
    }

    /**
     * 关闭流程
     *
     * @param processId 流程id
     * @return 是否成功
     */
    @Override
    public boolean closeProcess(long processId) {
        return updateCLoseFlag(processId, true);
    }

    /**
     * 获取单个流程的基础信息
     *
     * @param id 流程id
     * @return 基础信息
     */
    @Override
    public BaseProcessDTO getBaseInfo(Long id) {
        final ToaProcessEntity byId = toaProcessService.getById(id);
        if (Objects.isNull(byId)) {
            return null;
        }
        return processBasicConvert.processEntityToDTO(byId);
    }

    /**
     * 获取流程的打印模版绝对地址
     *
     * @param processId 流程id
     * @return 打印模版绝对地址
     */
    @Override
    public String getPrintTmp(Long processId) {
        String printTmp = formSettingService.getPrintTmp(processId);
        return Strings.isNullOrEmpty(printTmp) ? StrUtil.EMPTY : printTmp;
    }

    /**
     * 导出流程图片文件到硬盘
     *
     * @param processDefinition 流程信息
     * @param diagramFilePath   目标文件
     */
    private void exportDiagramToFile(final ProcessDefinition processDefinition, String
            diagramFilePath) {

        String diagramName = processDefinition.getDiagramResourceName();
        File diagramFile = new File(diagramFilePath);
        if (!diagramFile.exists()) {
            // 文件不存在 则创建上级目录
            try {
                Files.createParentDirs(diagramFile);

            } catch (IOException e) {
                log.error("创建流程图失败!", e);
                throw new NullPointerException("流程图创建失败");
            }
        }
        try {
            final String deploymentId = processDefinition.getDeploymentId();
            InputStream resourceAsStream = repositoryService
                    .getResourceAsStream(deploymentId, diagramName);
            FileCopyUtils.copy(resourceAsStream, new FileOutputStream(diagramFile));
        } catch (IOException e) {
            log.error("流程图转换图片发生错误!", e);
        }
    }

    private boolean updateStatus(long processId, int processStatusNormal) {
        final ToaProcessEntity processEntity = this.toaProcessService.getById(processId);
        processEntity.setStatus(processStatusNormal);
        return toaProcessService.upldate(processEntity);
    }
}


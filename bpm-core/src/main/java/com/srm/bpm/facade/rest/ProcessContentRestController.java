

package com.srm.bpm.facade.rest;

import com.google.common.collect.Lists;

import com.srm.bpm.infra.entity.ToaBillEntity;
import com.srm.bpm.infra.service.ToaBillService;

import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.FlowNode;
import org.activiti.bpmn.model.SequenceFlow;
import org.activiti.engine.HistoryService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.history.HistoricProcessInstance;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import cn.hutool.core.date.DateUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/bill/diagram/rest")
public class ProcessContentRestController {
    private final HistoryService historyService;
    private final RepositoryService repositoryService;
    private final ProcessEngine processEngine;
    private final ToaBillService billService;

    /**
     * 运行流程图接口
     *
     * @param billId   审批单
     * @param response 响应信息
     */
    @GetMapping("/run/{billId}")
    public void diagramRun(
            @PathVariable("billId") long billId,
            HttpServletResponse response
    ) {

        if (billId <= 0) {
            return;
        }
        final ToaBillEntity bill = billService.getById(billId);
        if (bill == null) {
            return;
        }
        final String processInstanceId = bill.getProcessInstanceId();

        if (!StringUtils.isEmpty(processInstanceId)) {
            final InputStream activitiProccessImage = getActivitiProccessImage(processInstanceId);
            if (activitiProccessImage != null) {
                try {
                    IOUtils.copy(activitiProccessImage, response.getOutputStream());
                } catch (IOException e) {
                    log.error("the resopne stream has error!", e);
                }
            }
        }
    }

    /**
     * 获取流程图像，已执行节点和流程线高亮显示
     */
    private InputStream getActivitiProccessImage(String pProcessInstanceId) {
        //logger.info("[开始]-获取流程图图像");
        try {
            //  获取历史流程实例
            HistoricProcessInstance historicProcessInstance = historyService
                    .createHistoricProcessInstanceQuery()
                    .processInstanceId(pProcessInstanceId).singleResult();

            if (historicProcessInstance != null) {
                // 获取流程定义

                // 获取流程历史中已执行节点，并按照节点在流程中执行先后顺序排序
                List<HistoricActivityInstance> historicActivityInstanceList = historyService
                        .createHistoricActivityInstanceQuery()
                        .processInstanceId(pProcessInstanceId)
                        .orderByHistoricActivityInstanceId().asc().list();

                // 已执行的节点ID集合
                List<String> executedActivityIdList = Lists.newArrayList();
//                int index = 1;
                //logger.info("获取已经执行的节点ID");
                for (HistoricActivityInstance activityInstance : historicActivityInstanceList) {
                    executedActivityIdList.add(activityInstance.getActivityId());
                }
                final String processDefinitionId = historicProcessInstance.getProcessDefinitionId();

                BpmnModel bpmnModel = repositoryService.getBpmnModel(processDefinitionId);

                // 已执行的线集合
                // 获取流程走过的线 (getHighLightedFlows是下面的方法)
                List<String> flowIds = getHighLightedFlows(bpmnModel, historicActivityInstanceList);


                //配置字体
                return processEngine.getProcessEngineConfiguration()
                        .getProcessDiagramGenerator().generateDiagram(bpmnModel, "jpg",
                        executedActivityIdList, flowIds,
                        "宋体", "宋体", "宋体", null, 2.0);
            }
        } catch (Exception e) {
            log.error("【异常】-获取流程图失败！" + e.getMessage(), e);
        }
        return null;
    }

    private List<String> getHighLightedFlows(BpmnModel bpmnModel, List<HistoricActivityInstance> historicActivityInstances) {
        List<String> highFlows = Lists.newArrayList();// 用以保存高亮的线flowId
        final int historicActivityInstanceSize = historicActivityInstances.size();
        for (int i = 0; i < historicActivityInstanceSize - 1; i++) {
            // 对历史流程节点进行遍历
            HistoricActivityInstance historicActivity = historicActivityInstances.get(i);// 第一个节点
            // 得到节点定义的详细信息
            final String activityId1 = historicActivity.getActivityId();
            FlowNode activityImpl = (FlowNode) bpmnModel.getMainProcess().getFlowElement(activityId1);

            // 用以保存后续开始时间相同的节点
            List<FlowNode> sameStartTimeNodes = Lists.newArrayList();
            FlowNode sameActivityImpl1 = null;

            HistoricActivityInstance activityImp2_;
            for (int k = i + 1; k <= historicActivityInstanceSize - 1; k++) {
                activityImp2_ = historicActivityInstances.get(k);// 后续第1个节点

                final Date startTime = historicActivity.getEndTime();
                final Date startTime2 = activityImp2_.getStartTime();
                final String activityType = historicActivity.getActivityType();
                final String activityType2 = activityImp2_.getActivityType();
                if (!StringUtils.equals(activityType, "userTask")
                        || !StringUtils.equals("userTask", activityType2)
                        || StringUtils.equals(DateUtil.formatDateTime(startTime), DateUtil.formatDateTime(startTime2))
                ) {
                    //都是usertask，且主节点与后续节点的开始时间相同，说明不是真实的后继节点
                    final String activityId = historicActivityInstances.get(k).getActivityId();
                    sameActivityImpl1 = (FlowNode) bpmnModel.getMainProcess()
                            .getFlowElement(activityId);//找到紧跟在后面的一个节点
                    break;
                }
            }
            // 将后面第一个节点放在时间相同节点的集合里
            sameStartTimeNodes.add(sameActivityImpl1);
            for (int j = i + 1; j < historicActivityInstanceSize - 1; j++) {
                // 后续第一个节点
                HistoricActivityInstance activityImpl1 = historicActivityInstances.get(j);
                // 后续第二个节点
                HistoricActivityInstance activityImpl2 = historicActivityInstances.get(j + 1);

                final Date startTime = activityImpl1.getStartTime();
                final Date startTime2 = activityImpl2.getStartTime();
                if (StringUtils.equals(DateUtil.formatDateTime(startTime), DateUtil.formatDateTime(startTime2))) {
                    // 如果第一个节点和第二个节点开始时间相同保存
                    FlowNode sameActivityImpl2 = (FlowNode) bpmnModel.getMainProcess()
                            .getFlowElement(activityImpl2.getActivityId());
                    sameStartTimeNodes.add(sameActivityImpl2);
                } else {// 有不相同跳出循环
                    break;
                }
            }
            // 取出节点的所有出去的线
            List<SequenceFlow> sequenceFlows = activityImpl.getOutgoingFlows();
            // 对所有的线进行遍历
            for (SequenceFlow sequenceFlow : sequenceFlows) {
                // 如果取出的线的目标节点存在时间相同的节点里，保存该线的id，进行高亮显示
                FlowNode pvmActivityImpl = (FlowNode) bpmnModel.getMainProcess()
                        .getFlowElement(sequenceFlow.getTargetRef());
                if (sameStartTimeNodes.contains(pvmActivityImpl)) {
                    highFlows.add(sequenceFlow.getId());
                }
            }

        }
        return highFlows;

    }
}

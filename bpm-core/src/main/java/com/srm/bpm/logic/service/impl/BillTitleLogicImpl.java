

package com.srm.bpm.logic.service.impl;

import com.google.common.base.Strings;

import com.srm.bpm.infra.po.BillTitlePO;
import com.srm.bpm.infra.service.ProcessBillTitleService;
import com.srm.bpm.logic.service.BillTitleLogic;
import com.srm.bpm.logic.util.DateToStringUtil;
import com.srm.bpm.logic.vo.BillTItleFormulaVo;

import org.springframework.expression.EvaluationContext;
import org.springframework.expression.Expression;
import org.springframework.expression.ParserContext;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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
public class BillTitleLogicImpl implements BillTitleLogic {
    private final ProcessBillTitleService billTitleService;

    @Override
    public String getTitle(long processId, String nickname) {
        final BillTitlePO billTitle = billTitleService.findByProcessId(processId);
        final LocalDateTime todayDate = LocalDateTime.now();
        if (billTitle == null) {
            // TODO 优化
            return DateToStringUtil.yyyymmdashNow();
        } else {
            // 表达式 spel
            // 具体存在以下几个参数信息
            // #{processCreater} 表示当前创建人
            // #{today} 当前时间
            // #{processTypeName} 审批类型名称
            // #{processName} 审批名称

            BillTItleFormulaVo formulaParams = new BillTItleFormulaVo();
            formulaParams.setProcessCreater(nickname);
            String formula = billTitle.getFormula();
            String day;

            final boolean timeFlag = billTitle.isTimeFlag();
            if (timeFlag) {
                day = DateToStringUtil.yyyymmdash(todayDate);

            } else {
                day = DateToStringUtil.yyyymmdashNow();
            }
            formulaParams.setToday(day);
            formulaParams.setProcessTypeName(billTitle.getProcessTypeName());
            formulaParams.setProcessName(billTitle.getProcessName());

            if (!Strings.isNullOrEmpty(formula)) {
                formula = "#{processName}-#{processCreater}-#{today}";
            }
            // spel 表达式
            final SpelExpressionParser parser = new SpelExpressionParser();
            final Expression formulaExp = parser.parseExpression(formula, ParserContext.TEMPLATE_EXPRESSION);
            EvaluationContext context = new StandardEvaluationContext(formulaParams);
            return formulaExp.getValue(context, String.class);

        }
    }
}

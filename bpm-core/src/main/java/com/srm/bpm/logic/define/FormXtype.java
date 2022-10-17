

package com.srm.bpm.logic.define;

import com.alibaba.fastjson.JSON;

import com.srm.bpm.logic.define.widget.BizWidget;
import com.srm.bpm.logic.define.widget.CheckboxgroupWidget;
import com.srm.bpm.logic.define.widget.DatetimeWidget;
import com.srm.bpm.logic.define.widget.DetailcalculateWidget;
import com.srm.bpm.logic.define.widget.DetailgroupWidget;
import com.srm.bpm.logic.define.widget.FileuploadWidget;
import com.srm.bpm.logic.define.widget.ImageuploadWidget;
import com.srm.bpm.logic.define.widget.MoneyWidget;
import com.srm.bpm.logic.define.widget.MultiselectWidget;
import com.srm.bpm.logic.define.widget.NumberWidget;
import com.srm.bpm.logic.define.widget.RadiogroupWidget;
import com.srm.bpm.logic.define.widget.SelectWidget;
import com.srm.bpm.logic.define.widget.TextWidget;
import com.srm.bpm.logic.define.widget.TextareaWidget;
import com.srm.bpm.logic.define.widget.TriggerselectWidget;
import com.srm.bpm.logic.define.widget.WidgetField;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
public enum FormXtype {
    /**
     * 单行文本
     */
    text {
        @Override
        public WidgetField toField(String widgetJSON) {
            return JSON.parseObject(widgetJSON, TextWidget.class);
        }
    },
    /**
     * 数字
     */
    number {
        @Override
        public WidgetField toField(String widgetJSON) {
            return JSON.parseObject(widgetJSON, NumberWidget.class);
        }
    },
    /**
     * 金额
     */
    money {
        @Override
        public WidgetField toField(String widgetJSON) {
            return JSON.parseObject(widgetJSON, MoneyWidget.class);
        }
    },
    /**
     * 多行文本
     */
    textarea {
        @Override
        public WidgetField toField(String widgetJSON) {
            return JSON.parseObject(widgetJSON, TextareaWidget.class);
        }
    },
    /**
     * 日期时间
     */
    datetime {
        @Override
        public WidgetField toField(String widgetJSON) {
            return JSON.parseObject(widgetJSON, DatetimeWidget.class);
        }
    },
    /**
     * 明细列表
     */
    detailgroup {
        @Override
        public WidgetField toField(String widgetJSON) {
            return JSON.parseObject(widgetJSON, DetailgroupWidget.class);
        }
    },
    /**
     * 单选按钮组
     */
    radiogroup {
        @Override
        public WidgetField toField(String widgetJSON) {
            return JSON.parseObject(widgetJSON, RadiogroupWidget.class);
        }
    },
    /**
     * 复选按钮组
     */
    checkboxgroup {
        @Override
        public WidgetField toField(String widgetJSON) {
            return JSON.parseObject(widgetJSON, CheckboxgroupWidget.class);
        }
    },
    /**
     * 下拉选择
     */
    select {
        @Override
        public WidgetField toField(String widgetJSON) {
            return JSON.parseObject(widgetJSON, SelectWidget.class);
        }
    },
    /**
     * 下拉复选框
     */
    multiselect {
        @Override
        public WidgetField toField(String widgetJSON) {
            return JSON.parseObject(widgetJSON, MultiselectWidget.class);
        }
    },
    /**
     * 位置定位
     */
    location {
        @Override
        public WidgetField toField(String widgetJSON) {
            return null;
        }
    },
    /**
     * 弹出选择
     */
    triggerselect {
        @Override
        public WidgetField toField(String widgetJSON) {
            return JSON.parseObject(widgetJSON, TriggerselectWidget.class);
        }
    },
    /**
     * 图片上传
     */
    imageupload {
        @Override
        public WidgetField toField(String widgetJSON) {
            return JSON.parseObject(widgetJSON, ImageuploadWidget.class);
        }
    },
    /**
     * 文件上传
     */
    fileupload {
        @Override
        public WidgetField toField(String widgetJSON) {
            return JSON.parseObject(widgetJSON, FileuploadWidget.class);
        }
    },
    /**
     * 业务只读控件
     */
    biz {
        @Override
        public WidgetField toField(String widgetJSON) {
            return JSON.parseObject(widgetJSON, BizWidget.class);
        }
    },
    /**
     * 明细计算文本控件
     */
    detailcalculate {
        @Override
        public WidgetField toField(String widgetJSON) {
            return JSON.parseObject(widgetJSON, DetailcalculateWidget.class);
        }
    };


    public abstract WidgetField toField(String widgetJSON);

}

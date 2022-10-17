

package com.jingtong.devools;

import java.util.List;

import cn.hutool.core.util.StrUtil;

/**
 * @author fitz.yang
 * @version 2021.02
 * @since triton 2021.02
 */
public enum CodeModule {

    /**
     * 组织机构
     */
    BPM("bpm", "", StrUtil.splitTrim("bill_biz_data,bill_cc_person,bill_data_json,bill_like,bill_read_record,bill_reply,bill_reply_attachment,bill_stat,bill_tally,bill_task,datasource_combo,datasource_conditions,datasource_filed,datasource_popover,form_desinger,form_detail_setting,form_expression,form_extensions,form_field,form_setting,process_bill_title,process_desinger,process_node_approver,process_node_cc,process_node_connection,process_node_extend,process_node_form_field,process_setting,process_type,process_visual_range,sys_code_format,toa_bill,toa_datasource,toa_form,toa_process", ",")),
    ;

    private final String pkg;
    private final String tablePrefix;

    private final List<String> tables;

    CodeModule(String pkg, String tablePrefix, List<String> tables) {
        this.pkg = pkg;
        this.tablePrefix = tablePrefix;
        this.tables = tables;
    }

    public String getPkg() {
        return pkg;
    }

    public String getTablePrefix() {
        return tablePrefix;
    }

    public List<String> getTables() {
        return tables;
    }
}

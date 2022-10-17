

package com.jingtong.devools;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.core.toolkit.StringPool;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.InjectionConfig;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import com.baomidou.mybatisplus.generator.config.FileOutConfig;
import com.baomidou.mybatisplus.generator.config.GlobalConfig;
import com.baomidou.mybatisplus.generator.config.PackageConfig;
import com.baomidou.mybatisplus.generator.config.StrategyConfig;
import com.baomidou.mybatisplus.generator.config.TemplateConfig;
import com.baomidou.mybatisplus.generator.config.TemplateType;
import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import cn.hutool.core.util.StrUtil;


/**
 * @author fitz.yang
 * @version 2021.02
 * @since triton 2021.02
 */
public class CodeGenerateTool {


    public static void main(String[] args) {
                genCodeByTables(new String[]{"sys_attachment"}, "sys_", "bpmserver");//需要的表，后面是表示需要去除的前缀
    }

    private static void genCode(CodeModule codeModule) {
        String[] tables = codeModule.getTables().toArray(new String[]{});
        String tablePrefix = codeModule.getTablePrefix();
        String codePackage = codeModule.getPkg();
        genCodeByTables(tables, tablePrefix, codePackage);
    }

    private static void genCodeByTables(String[] tables, String tablePrefix, String codePackage) {
        // 代码生成器
        AutoGenerator mpg = new AutoGenerator();
        // 全局配置
        GlobalConfig gc = new GlobalConfig();
        String projectPath = System.getProperty("user.dir");
        String rootPath = projectPath + "/bpm-server";

        gc.setOutputDir(rootPath + "/src/main/java");
        gc.setAuthor("JT");
        gc.setOpen(true);
        gc.setFileOverride(true);
        gc.setBaseResultMap(true);
        gc.setServiceName("%sService");//service 命名方式
        gc.setMapperName("%sDao");
        gc.setEntityName("%sEntity");
        gc.setXmlName("%sDao");
        mpg.setGlobalConfig(gc);

        // 数据源配置
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setUrl("jdbc:mysql://127.0.0.1:3306/haosen_srm");
        dsc.setDriverName("com.mysql.jdbc.Driver");
        dsc.setUsername("root");
        dsc.setPassword("root");
        dsc.setDbType(DbType.MYSQL);
        dsc.setTypeConvert(ScisDbTypeConvert.INSTANCE);
        mpg.setDataSource(dsc);

        // 包配置
        PackageConfig pc = new PackageConfig();
        pc.setModuleName(String.format("%s.infra", codePackage));
        pc.setMapper("dao");
        pc.setParent("com.jingtong");
        mpg.setPackageInfo(pc);

        // 自定义配置
        InjectionConfig cfg = new InjectionConfig() {
            @Override
            public void initMap() {
                // to do nothing
            }
        };

        // 如果模板引擎是 freemarker
        String templatePath = "/templates/mapper.xml.ftl";

        String moduleName = pc.getModuleName();
        String modulePath = moduleName.replace(".", File.separator);
        // 自定义输出配置
        List<FileOutConfig> focList = new ArrayList<>();
        // 自定义配置会被优先输出
        focList.add(new FileOutConfig(templatePath) {
            @Override
            public String outputFile(TableInfo tableInfo) {
                // 自定义输出文件名 ， 如果你 Entity 设置了前后缀、此处注意 xml 的名称会跟着发生变化！！
                String entityName = tableInfo.getEntityName();
                String entityFileName = StrUtil.replace(entityName, "Entity", StringPool.EMPTY);
                return rootPath + "/src/main/resources/mapper/" + modulePath + "/" + entityFileName + "Dao" + StringPool.DOT_XML;
            }
        });
        cfg.setFileOutConfigList(focList);
        mpg.setCfg(cfg);

        // 配置模板
        TemplateConfig templateConfig = new TemplateConfig();
        // 不生成 Controller
        templateConfig.disable(TemplateType.CONTROLLER, TemplateType.XML);
        mpg.setTemplate(templateConfig);

        // 策略配置
        StrategyConfig strategy = new StrategyConfig();
        strategy.setNaming(NamingStrategy.underline_to_camel);
        strategy.setColumnNaming(NamingStrategy.underline_to_camel);
        strategy.setCapitalMode(true);
        strategy.setEntityLombokModel(true);
        strategy.setRestControllerStyle(false);
        strategy.setInclude(tables);
        strategy.setControllerMappingHyphenStyle(true);
        strategy.setTablePrefix(tablePrefix);
        strategy.setLogicDeleteFieldName("is_deleted");

        strategy.setSuperServiceClass("com.jingtong.base.infra.service.BaseService");
        strategy.setSuperServiceImplClass("com.jingtong.base.infra.service.impl.BaseServiceImpl");
        strategy.setSuperEntityClass("com.jingtong.base.infra.entity.BaseEntity");
        strategy.setSuperEntityColumns("id", "version", "is_deleted", "creation_time", "update_time");
        strategy.setSuperMapperClass("com.jingtong.base.infra.dao.BaseDao");

        mpg.setStrategy(strategy);
        mpg.setTemplateEngine(new FreemarkerTemplateEngine());
        mpg.execute();
    }

}

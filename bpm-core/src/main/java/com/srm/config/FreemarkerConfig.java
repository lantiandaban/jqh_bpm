

package com.srm.config;

import freemarker.template.TemplateModelException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Component
public class FreemarkerConfig {
    @Value("${bpm.ctx}")
    private String ctx;
    @Autowired
    private freemarker.template.Configuration configuration;

    @PostConstruct
    public void freeMarkerConfigurer() {
        Map<String, Object> sharedVariables = new HashMap<>();
        sharedVariables.put("ctx", ctx);
        for (String s : sharedVariables.keySet()) {
            try {
                configuration.setSharedVariable(s, sharedVariables.get(s));
            } catch (TemplateModelException e) {
                e.printStackTrace();
            }
        }

    }
}

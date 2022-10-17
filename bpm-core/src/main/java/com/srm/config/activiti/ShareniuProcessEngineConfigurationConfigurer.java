

package com.srm.config.activiti;


import com.srm.config.activiti.diagram.ToaProcessDiagramGenerator;

import org.activiti.spring.SpringProcessEngineConfiguration;
import org.activiti.spring.boot.ProcessEngineConfigurationConfigurer;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
@Component
@Configuration
public class ShareniuProcessEngineConfigurationConfigurer implements ProcessEngineConfigurationConfigurer {
    @Override
    public void configure(SpringProcessEngineConfiguration processEngineConfiguration) {
        processEngineConfiguration.setActivityFontName("宋体");
        processEngineConfiguration.setLabelFontName("宋体");
        processEngineConfiguration.setAnnotationFontName("宋体");

        processEngineConfiguration.setProcessDiagramGenerator(new ToaProcessDiagramGenerator());
    }


}

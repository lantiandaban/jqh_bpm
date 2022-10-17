 

package com.srm.bpm.facde;

import lombok.extern.slf4j.Slf4j;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Slf4j
public class BaseHttpClient {
    static String ListUrl="/bill/list/feign";
    static String processUrl="/bill/process/feign";
    static String datasourceUrl="/process/datasource/feign";
    static String thirdPartUrl="/third/part/bill";
    String host;
}

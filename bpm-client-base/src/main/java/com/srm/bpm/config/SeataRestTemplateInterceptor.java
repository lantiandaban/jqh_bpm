

package com.srm.bpm.config;

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.support.HttpRequestWrapper;

import java.io.IOException;

import io.seata.core.context.RootContext;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public class SeataRestTemplateInterceptor implements ClientHttpRequestInterceptor {
    /**
     * Intercept the given request, and return a response. The given {@link
     * ClientHttpRequestExecution} allows the interceptor to pass on the request and response to the
     * next entity in the chain.
     * <p>A typical implementation of this method would follow the following pattern:
     * <ol>
     * <li>Examine the {@linkplain HttpRequest request} and body</li>
     * <li>Optionally {@linkplain HttpRequestWrapper
     * wrap} the request to filter HTTP attributes.</li>
     * <li>Optionally modify the body of the request.</li>
     * <li><strong>Either</strong>
     * <ul>
     * <li>execute the request using
     * {@link ClientHttpRequestExecution#execute(HttpRequest, byte[])},</li>
     * <strong>or</strong>
     * <li>do not execute the request to block the execution altogether.</li>
     * </ul>
     * <li>Optionally wrap the response to filter HTTP attributes.</li>
     * </ol>
     *
     * @param request   the request, containing method, URI, and headers
     * @param body      the body of the request
     * @param execution the request execution
     * @return the response
     * @throws IOException in case of I/O errors
     */
    @Override
    public ClientHttpResponse intercept(HttpRequest httpRequest, byte[] bytes, ClientHttpRequestExecution clientHttpRequestExecution) throws IOException {
        HttpRequestWrapper requestWrapper = new HttpRequestWrapper(httpRequest);
        String xid = RootContext.getXID();
        if (StringUtils.isNotEmpty(xid)) {
            requestWrapper.getHeaders().add(RootContext.KEY_XID, xid);
        }

        return clientHttpRequestExecution.execute(requestWrapper, bytes);
    }
}

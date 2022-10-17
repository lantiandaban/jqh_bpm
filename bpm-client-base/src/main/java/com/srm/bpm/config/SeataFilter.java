

package com.srm.bpm.config;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import io.seata.core.context.RootContext;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Component
public class SeataFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, javax.servlet.FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) servletRequest;
        String xid = req.getHeader(RootContext.KEY_XID.toLowerCase());
        boolean isBind = false;
        if (StringUtils.isNotBlank(xid)) {
            RootContext.bind(xid);
            isBind = true;
        }
        try {
            filterChain.doFilter(servletRequest, servletResponse);
        } finally {
            if (isBind) {
                RootContext.unbind();
            }
        }
    }

    @Override
    public void destroy() {
    }
}

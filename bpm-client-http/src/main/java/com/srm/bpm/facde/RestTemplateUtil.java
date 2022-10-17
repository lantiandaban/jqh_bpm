 

package com.srm.bpm.facde;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.srm.common.data.rest.R;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;
import java.util.Objects;

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
@Service
@Slf4j
public class RestTemplateUtil {
    private final RestTemplate restTemplate;

    public <T> R getList(String url, Map<String, Object> params, String user, Class<T> clazz) {
        final ResponseEntity<R> exchange = get(url, params, user);
        final String s = JSON.toJSONString(exchange.getBody().getData());
        final List<T> datasourceDTOS = JSON.parseArray(s, clazz);
        if (!Objects.isNull(exchange.getBody()) && !Objects.isNull(exchange.getBody().getTotal())) {
            return R.ok(datasourceDTOS, exchange.getBody().getTotal());
        } else {
            return R.ok(datasourceDTOS);
        }
    }

    public <T> R<T> getOne(String url, Map<String, Object> params, String user, Class<T> clazz) {

        final ResponseEntity<R> exchange = get(url, params, user);
        final String s = JSON.toJSONString(exchange.getBody().getData());
        final T datasourceDTOS = JSON.parseObject(s, clazz);
        return R.ok(datasourceDTOS);
    }

    private ResponseEntity<R> get(String url, Map<String, Object> params, String user) {
        HttpEntity<String> a = new HttpEntity(getAuthHeader(user));
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);
        for (String s : params.keySet()) {
            if (Objects.isNull(params.get(s))) {
                builder.queryParam(s, "");
                continue;
            }
            try {
                builder.queryParam(s, URLEncoder.encode(params.get(s).toString(), "UTF-8"));
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        String realUrl = builder.build().toString();
        final ResponseEntity<R> exchange = restTemplate.exchange(realUrl, HttpMethod.GET, a, R.class);
        return exchange;
    }

    public <E> R<E> postReturnOne(String url, JSONObject data, String user, Class<E> clazz) {
        final ResponseEntity<R> exchange = post(url, data, user);
        final String s = JSON.toJSONString(exchange.getBody().getData());
        final E datasourceDTOS = JSON.parseObject(s, clazz);
        return R.ok(datasourceDTOS);
    }

    public R postNoReturn(String url, JSONObject data, String user) {
        final ResponseEntity<R> exchange = post(url, data, user);
        return R.ok();
    }

    public <E> R<List<E>> postReturnList(String url, JSONObject data, String user, Class<E> clazz) {
        final ResponseEntity<R> exchange = post(url, data, user);
        final String s = JSON.toJSONString(exchange.getBody().getData());
        final List<E> datasourceDTOS = JSON.parseArray(s, clazz);
        return R.ok(datasourceDTOS);
    }

    public ResponseEntity<R> post(String url, JSONObject data, String user) {
        final HttpHeaders authHeader = getAuthHeader(user);
        authHeader.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> a = new HttpEntity(data, authHeader);
        final ResponseEntity<R> exchange = restTemplate.exchange(url, HttpMethod.POST, a, R.class);
        return exchange;
    }

    public R delete(String url, String user) {
        HttpEntity<String> a = new HttpEntity(getAuthHeader(user));
        final ResponseEntity<R> exchange = restTemplate.exchange(url, HttpMethod.DELETE, a, R.class);
        return R.state((Boolean) exchange.getBody().getData());
    }

    public R put(String url, String user) {
        HttpEntity<String> a = new HttpEntity(getAuthHeader(user));
        final ResponseEntity<R> exchange = restTemplate.exchange(url, HttpMethod.PUT, a, R.class);
        return R.state((Boolean) exchange.getBody().getData());
    }

    private HttpHeaders getAuthHeader(String user) {
        HttpHeaders header = new HttpHeaders();
        header.add("Authorization", user);
        return header;
    }
}


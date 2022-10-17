
//
//package com.jingtong.bpm.facde;
//
//import com.google.common.base.Strings;
//
//import com.alibaba.fastjson.JSON;
//import com.alibaba.fastjson.TypeReference;
//import com.jingtong.data.rest.R;
//
//import org.springframework.stereotype.Service;
//
//import java.io.IOException;
//import java.io.UnsupportedEncodingException;
//import java.net.URLEncoder;
//import java.security.KeyManagementException;
//import java.security.NoSuchAlgorithmException;
//import java.security.SecureRandom;
//import java.security.cert.CertificateException;
//import java.security.cert.X509Certificate;
//import java.util.Collections;
//import java.util.List;
//import java.util.Map;
//import java.util.Objects;
//import java.util.concurrent.TimeUnit;
//
//import javax.net.ssl.SSLContext;
//import javax.net.ssl.SSLSocketFactory;
//import javax.net.ssl.TrustManager;
//import javax.net.ssl.X509TrustManager;
//
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import okhttp3.ConnectionPool;
//import okhttp3.HttpUrl;
//import okhttp3.Interceptor;
//import okhttp3.MediaType;
//import okhttp3.OkHttpClient;
//import okhttp3.Request;
//import okhttp3.RequestBody;
//import okhttp3.Response;
//import okhttp3.internal.Util;
//
///**
// * <p> </p>
// *
// * @author BOGON
// * @version 1.0
// * @since JDK 1.8
// */
//@RequiredArgsConstructor
//@Service
//@Slf4j
//public class OkHttpUtil {
//    private static OkHttpClient okHttpClient;
//
//    static final MediaType JSON_TYPE = MediaType.parse("application/json; charset=utf-8");
//
//    public X509TrustManager x509TrustManager() {
//        return new X509TrustManager() {
//            @Override
//            public void checkClientTrusted(X509Certificate[] x509Certificates, String s) throws CertificateException {
//            }
//
//            @Override
//            public void checkServerTrusted(X509Certificate[] x509Certificates, String s) throws CertificateException {
//            }
//
//            @Override
//            public X509Certificate[] getAcceptedIssuers() {
//                return new X509Certificate[0];
//            }
//        };
//    }
//
//    public SSLSocketFactory sslSocketFactory() {
//        try {
//            //信任任何链接
//            SSLContext sslContext = SSLContext.getInstance("TLS");
//            sslContext.init(null, new TrustManager[]{x509TrustManager()}, new SecureRandom());
//            return sslContext.getSocketFactory();
//        } catch (NoSuchAlgorithmException e) {
//            e.printStackTrace();
//        } catch (KeyManagementException e) {
//            e.printStackTrace();
//        }
//        return null;
//    }
//
//    /**
//     * Create a new connection pool with tuning parameters appropriate for a single-user
//     * application. The tuning parameters in this pool are subject to change in future OkHttp
//     * releases. Currently
//     */
//    public ConnectionPool pool() {
//        return new ConnectionPool(200, 5, TimeUnit.MINUTES);
//    }
//
//    public OkHttpClient getHttpClient() {
//        if (null == okHttpClient) {
//            okHttpClient = new OkHttpClient.Builder()
//                    .sslSocketFactory(sslSocketFactory(), x509TrustManager())
//                    .addNetworkInterceptor(new OkHttpNetInterceptor())
//                    .retryOnConnectionFailure(false)//是否开启缓存
//                    .connectionPool(pool())//连接池
//                    .connectTimeout(10L, TimeUnit.SECONDS)
//                    .readTimeout(10L, TimeUnit.SECONDS)
//                    .build();
//            return okHttpClient;
//        }
//        return okHttpClient;
//    }
//
//    public R put(String url, String user) {
//        Request request = new Request.Builder()
//                .url(url)
//                .addHeader("Authorization", user)
//                .put(Util.EMPTY_REQUEST)
//                .build();
//        Response response = null;
//        try {
//            response = getHttpClient().newCall(request).execute();
//            if (response.isSuccessful()) {
//                return R.ok();
//            } else {
//                return R.state(false);
//            }
//        } catch (IOException e) {
//            e.printStackTrace();
//        } finally {
//            if (response != null) {
//                response.close();
//            }
//        }
//        return R.state(false);
//    }
//
//    public R delete(String url, String user) {
//        Request request = new Request.Builder()
//                .url(url)
//                .addHeader("Authorization", user)
//                .delete()
//                .build();
//        Response response = null;
//        try {
//            response = getHttpClient().newCall(request).execute();
//            if (response.isSuccessful()) {
//                return R.ok();
//            } else {
//                return R.state(false);
//            }
//        } catch (IOException e) {
//            e.printStackTrace();
//        } finally {
//            if (response != null) {
//                response.close();
//            }
//        }
//        return R.state(false);
//    }
//
//    public <E> R<List<E>> post(String url, Object requestBody, String user) {
//        RequestBody body = RequestBody.create(JSON_TYPE, JSON.toJSONString(requestBody));
//        Request request = new Request.Builder()
//                .url(url)
//                .addHeader("Authorization", user)
//                .post(body)
//                .build();
//        Response response = null;
//        try {
//            response = getHttpClient().newCall(request).execute();
//            if (response.isSuccessful()) {
//                String result = response.body().string();
//                R<List<E>> r = (R<List<E>>) JSON.parseObject(result, R.class);
//                return r;
//            }
//        } catch (IOException e) {
//            e.printStackTrace();
//        } finally {
//            if (response != null) {
//                response.close();
//            }
//        }
//        return R.state(false);
//    }
//
//    public <E> R<E> postReturnOne(String url, Object requestBody, String user) {
//        RequestBody body = RequestBody.create(JSON_TYPE, JSON.toJSONString(requestBody));
//        Request request = new Request.Builder()
//                .url(url)
//                .addHeader("Authorization", user)
//                .post(body)
//                .build();
//        Response response = null;
//        try {
//            response = getHttpClient().newCall(request).execute();
//            if (response.isSuccessful()) {
//                String result = response.body().string();
//                R<E> r = (R<E>) JSON.parseObject(result, R.class);
//                return r;
//            }
//        } catch (IOException e) {
//            e.printStackTrace();
//        } finally {
//            if (response != null) {
//                response.close();
//            }
//        }
//        return R.state(false);
//    }
//
//    public <T> R<List<T>> getList(String url, Map<String, Object> params, String user) {
//
//        final String reposeStr = get(url, params, user);
//        if (Strings.isNullOrEmpty(reposeStr)) {
//            return R.ok(Collections.emptyList());
//        }
//        R<List<T>> r = (R<List<T>>) JSON.parseObject(reposeStr, R.class);
//        return r;
//    }
//
//    public String get(String url, Map<String, Object> params, String user) {
//        Request.Builder reqBuild = new Request.Builder();
//        HttpUrl.Builder urlBuilder = HttpUrl.parse(url)
//                .newBuilder();
//        for (String s : params.keySet()) {
//            if (!Objects.isNull(params.get(s))) {
//                try {
//                    urlBuilder.addQueryParameter(s, URLEncoder.encode(params.get(s).toString(), "UTF-8"));
//                } catch (UnsupportedEncodingException e) {
//                    e.printStackTrace();
//                }
//            }
//        }
//        reqBuild.url(urlBuilder.build());
//        reqBuild.addHeader("Authorization", user);
//        Request request = reqBuild.build();
//        Response response = null;
//        try {
//            response = getHttpClient().newCall(request).execute();
//            if (response.isSuccessful()) {
//                String result = response.body().string();
//                return result;
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        } finally {
//            if (response != null) {
//                response.close();
//            }
//        }
//        return "";
//    }
//
//
//    public <T> R<T> getOne(String url, Map<String, Object> params, String user) {
//        final String resposeStr = get(url, params, user);
//        if (Strings.isNullOrEmpty(resposeStr)) {
//            return R.ok();
//        }
//        R<T> r = JSON.parseObject(resposeStr,new TypeReference<R<T>>() {});
//        return r;
//    }
//
//    class OkHttpNetInterceptor implements Interceptor {
//        @Override
//        public Response intercept(Chain chain) throws IOException {
//            Request request = chain.request().newBuilder()
//                    .addHeader("Connection", "close").build();
//            return chain.proceed(request);
//        }
//    }
//}

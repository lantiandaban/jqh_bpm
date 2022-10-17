

package com.srm.common.data.rest;

import java.util.Collections;
import java.util.Map;

import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import com.srm.common.util.datetime.DateTimeUtil;
import com.srm.common.util.error.BasisCode;
import com.srm.common.util.error.ErrorCode;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
@ApiModel("全局返回结果")
public class R<T> {
    @ApiModelProperty("返回码")
    private int code;
    @ApiModelProperty("返回消息")
    private String msg;
    @ApiModelProperty("返回数据")
    private T data;
    @ApiModelProperty("错误信息")
    private Map<String, Object> errors;
    @ApiModelProperty("时间戳")
    private long timestamp;
    @ApiModelProperty("分页数据总数")
    private long total;

    R() {
        this.code = BasisCode.SUCESS.getCode();
        this.msg = StrUtil.EMPTY;
        this.timestamp = DateTimeUtil.timeMills();
    }

    @SuppressWarnings("unchecked")
    public static <T> R<T> ok() {
        return R.<T>builder();
    }

    @SuppressWarnings("unchecked")
    public static <T> R<T> ok(T data) {
        return (R<T>) ok().data(data);
    }

    @SuppressWarnings("unchecked")
    public static <T> R<T> ok(T data, Long total) {
        final R<T> ok = ok();
        final R<T> data1 = ok.data(data);
        data1.setTotal(total);
        return data1;
    }

    public static R error() {
        return error(BasisCode.SERVER_ERROR, "操作失败");
    }

    public static R error(String msg) {
        return error(BasisCode.SERVER_ERROR, msg);
    }

    public static R error(ErrorCode code, String msg) {
        return R.builder().code(code).message(msg);
    }

    @SuppressWarnings("unchecked")
    public static <T> R error(ErrorCode code, String msg, T data) {
        return R.builder().code(code).message(msg).data(data);
    }

    @SuppressWarnings("unchecked")
    public static R error(ErrorCode errorCode, String msg, Map<String, Object> errors) {
        return builder().code(errorCode).message(msg).error(errors);
    }

    @SuppressWarnings("unchecked")
    public static R state(boolean state) {
        return state ? R.ok().data(true) : R.error().data(false);
    }

    public static R empty() {
        return ok(Collections.emptyMap());
    }


    public static R emptyList() {
        return ok(Collections.emptyList());
    }

    /**
     * 设置错误信息
     *
     * @param errors 错误信息
     * @return 响应体
     */
    public R error(Map<String, Object> errors) {
        this.errors = errors;
        return this;
    }

    /**
     * 设置错误信息
     *
     * @param message 错误信息
     * @return 响应体
     */
    public R message(String message) {
        this.msg = message;
        return this;
    }

    /**
     * 设置响应体的错误码
     *
     * @param errorCode 错误码
     * @return 响应体
     */
    public R code(ErrorCode errorCode) {
        this.code = errorCode.getCode();
        return this;
    }

    /**
     * 响应信息中添加数据返回
     *
     * @param data 数据信息
     * @return 当前响应对象
     */
    @SuppressWarnings("unchecked")
    public R<T> data(T data) {
        this.data = data;
        return this;
    }

    private static <T> R builder() {
        return new R<T>();
    }
}

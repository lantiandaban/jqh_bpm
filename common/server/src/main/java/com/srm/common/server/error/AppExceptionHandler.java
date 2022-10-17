

package com.srm.common.server.error;

import com.google.common.base.Strings;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;

import cn.hutool.core.collection.CollectionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.srm.common.data.exception.ExpiredTokenException;
import com.srm.common.data.exception.PermissionException;
import com.srm.common.data.exception.RbException;
import com.srm.common.data.rest.R;
import com.srm.common.server.web.Ii8nMessageService;
import com.srm.common.util.error.BasisCode;
import com.srm.common.util.error.ErrorCode;

/**
 * Rest接口异常处理器
 *
 * @author fitz.yang
 * @version 2021.02
 * @since triton 2021.02
 */
@RequiredArgsConstructor
@RestControllerAdvice(annotations = {RestController.class})
@Slf4j
public class AppExceptionHandler {
    private final Ii8nMessageService messageService;

    /**
     * 处理业务异常
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(RbException.class)
    public R handleRbException(RbException e) {
        ErrorCode errorCode = e.getCode();

        String msg = e.getMsg();
        if (Strings.isNullOrEmpty(msg)) {
            String message;
            if (Objects.isNull(e.getParams())) {
                message = messageService.getMessage(errorCode);
            } else {
                message = messageService.getMessage(errorCode, e.getParams());
            }
            msg = message;
        }
        return R.error().code(errorCode).message(msg);
    }

    /**
     * 处理服务权限控制处理
     */
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(PermissionException.class)
    public R handlePermissionException(PermissionException e) {
        final ErrorCode errorCode = e.getCode();
        return R.error().code(errorCode).data(e.getData()).message(e.getMessage());
    }

    /**
     * 处理 过期凭证问题
     */
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(ExpiredTokenException.class)
    public R handleExpiredCredentialsException(ExpiredTokenException e) {
        final ErrorCode errorCode = e.getCode();
        return R.error().code(errorCode).message(e.getMsg()).data(Collections.emptyMap());
    }


    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(value = SQLException.class)
    public R sqlException(SQLException exception) {
        log.error("sql has exception", exception);
        final String message = "sql has exception";
        return R.error().code(BasisCode.DB_ERROR).message(message);
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(NoHandlerFoundException.class)
    public R handlerNoFoundException(Exception e) {
        log.error(e.getMessage(), e);
        return R.error().code(BasisCode.NOT_FOUND);
    }


    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public R handleException(Exception e) {
        log.error(e.getMessage(), e);
        return R.error().code(BasisCode.SERVER_ERROR);
    }


    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(value = BindException.class)
    public R bindException(BindException e) {
        log.error("参数绑定失败错误!", e);
        return validatorException(e.getBindingResult());
    }

    /**
     * 处理请求参数格式错误 @RequestParam上validate失败后抛出的异常是javax.validation.ConstraintViolationException
     *
     * @param e 请求参数格式错误
     * @return 响应信息
     */
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public R exception(ConstraintViolationException e) {
        String message = e.getConstraintViolations().stream().map(ConstraintViolation::getMessage).collect(Collectors.joining());
        return R.error().code(BasisCode.PARAM_VALID).message(message);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public R exception(MethodArgumentNotValidException e) {
        log.error("参数校验错误!", e);
        return validatorException(e.getBindingResult());
    }

    /**
     * 忽略参数异常处理器
     *
     * @param e 忽略参数异常
     * @return ResponseResult
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public R exception(MissingServletRequestParameterException e) {
        log.error("", e);
        return R.error().code(BasisCode.PARAM_VALID).message("请求参数 " + e.getParameterName() + " 不能为空");
    }


    /**
     * 缺少请求体异常处理器
     *
     * @param e 异常
     * @return 响应信息
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(value = HttpMessageNotReadableException.class)
    public R exception(HttpMessageNotReadableException e) {
        log.error("参数校验错误!", e);
        return R.error().code(BasisCode.PARAM_VALID).message("参数校验失败:" + e.getMessage());
    }

    private R validatorException(BindingResult bindingResult) {
        final List<ObjectError> errorList = bindingResult.getAllErrors();
        final String message = "参数错误!";
        if (errorList != null) {
            Map<String, Object> errMap = new HashMap<>();
            bindingResult.getFieldErrors().forEach(item -> {
                errMap.put(item.getField(), item.getDefaultMessage());
            });

            if (CollectionUtil.isNotEmpty(errorList)) {
                log.error("错误参数详情如下:{}", errorList);
                return R.error(message).error(errMap).code(BasisCode.PARAM_VALID);
            }
        }
        return R.error(message).code(BasisCode.PARAM_VALID);
    }
}



package com.srm.common.base.util;

import com.srm.common.data.exception.RbException;

import org.hibernate.validator.messageinterpolation.ResourceBundleMessageInterpolator;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.validation.beanvalidation.MessageSourceResourceBundleLocator;

import java.util.Locale;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;

/**
 * 校验工具类
 *
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
public class ValidatorUtils {

    /**
     * 校验对象
     *
     * @param object 待校验对象
     * @param groups 待校验的组
     * @throws RbException 校验不通过，则报RbException异常
     */
    public static void validateEntity(Object object, Class<?>... groups)
            throws RbException {
        Locale.setDefault(LocaleContextHolder.getLocale());
        Validator validator = Validation.byDefaultProvider().configure().messageInterpolator(
                new ResourceBundleMessageInterpolator(new MessageSourceResourceBundleLocator(getMessageSource())))
                .buildValidatorFactory().getValidator();
        Set<ConstraintViolation<Object>> constraintViolations = validator.validate(object, groups);
        if (!constraintViolations.isEmpty()) {
            ConstraintViolation<Object> constraint = constraintViolations.iterator().next();
            throw new RbException(constraint.getMessage());
        }
    }

    private static ResourceBundleMessageSource getMessageSource() {
        ResourceBundleMessageSource bundleMessageSource = new ResourceBundleMessageSource();
        bundleMessageSource.setDefaultEncoding("UTF-8");
        bundleMessageSource.setBasenames("i18n/validation", "i18n/validation_common");
        return bundleMessageSource;
    }
}

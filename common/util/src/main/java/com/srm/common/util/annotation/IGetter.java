

package com.srm.common.util.annotation;

import java.io.Serializable;

/**
 * getter方法接口定义
 *
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
@FunctionalInterface
public interface IGetter<T> extends Serializable {
    Object apply(T source);
}

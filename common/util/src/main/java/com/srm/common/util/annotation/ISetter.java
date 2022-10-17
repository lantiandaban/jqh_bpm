

package com.srm.common.util.annotation;

import java.io.Serializable;

/**
 * setter方法接口定义
 *
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
@FunctionalInterface
public interface ISetter<T, U> extends Serializable {
    void accept(T t, U u);
}

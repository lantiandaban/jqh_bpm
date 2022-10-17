

package com.srm.bpm.logic.service;

/**
 * <p> </p>
 *
 * @author Administrator
 * @version 1.0
 * @since JDK 1.7
 */
public interface LinkqueryLogic<T> {
    T excute(String jsonStr, String userId,long processId);
}

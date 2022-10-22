
package com.srm.bpm.logic.service;

import java.util.List;

import com.srm.bpm.logic.dto.FlowMsgDTO;

/**
 * <p>
 * </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface PushMsgLogic {
	/**
	 * 推送消息
	 * 
	 * @param allMsg
	 */

	void push(List<FlowMsgDTO> allMsg);
}

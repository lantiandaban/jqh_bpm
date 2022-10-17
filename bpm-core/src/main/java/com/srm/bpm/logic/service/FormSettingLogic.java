

package com.srm.bpm.logic.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public interface FormSettingLogic {

    boolean updatePrintTemp(Long processId,  MultipartFile var1);

    boolean updateFormLink(long processId, String formLink, String approveLink,Integer manualStartFlag);
}

 

package com.srm.bpm.logic.dto;

import java.io.Serializable;

import lombok.Data;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
@Data
public class AttachmentDTO implements Serializable {
    private Long id;
    private String name;
    private String type;
    private Long size;
    private String hash;
    private String url;
    private String path;
}

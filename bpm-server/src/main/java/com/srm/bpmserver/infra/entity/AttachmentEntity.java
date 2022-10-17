

package com.srm.bpmserver.infra.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.srm.common.base.infra.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 系统附件表
 * </p>
 *
 * @author JT
 * @since 2021-07-13
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_attachment")
public class AttachmentEntity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 文件hash
     */
    private String hash;

    /**
     * 访问地址
     */
    private String url;

    /**
     * 文件名称
     */
    private String fileName;

    /**
     * 附件类型
     */
    private String fileType;

    /**
     * 文件大小
     */
    private Long fileSize;

    /**
     * 存储地址
     */
    private String filePath;

    /**
     * 图片标记
     */
    private Integer imageFlag;

    /**
     * 图片宽
     */
    private Integer imageWidth;

    /**
     * 图片高
     */
    private Integer imageHeight;

    /**
     * 上传时间
     */
    private Integer dateline;

    /**
     * 上传人
     */
    private Long uploader;

    /**
     * 80x80,80x120类似
     */
    private String thumbnails;


}

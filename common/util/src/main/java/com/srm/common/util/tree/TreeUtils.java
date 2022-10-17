

package com.srm.common.util.tree;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * <p> </p>
 *
 * @author BOGON
 * @version 1.0
 * @since JDK 1.8
 */
public class TreeUtils {
    /**
     * 根据pid，构建树节点
     */
    public static <T extends TreeVO> List<T> build(List<T> treeNodes, String pid) {
        //pid不能为空
        List<T> treeList = new ArrayList<>();
        for(T treeNode : treeNodes) {
            if (pid.equals(treeNode.getParentId())) {
                treeList.add(findChildren(treeNodes, treeNode));
            }
        }

        return treeList;
    }

    /**
     * 查找子节点
     */
    private static <T extends TreeVO> T findChildren(List<T> treeNodes, T rootNode) {
        for(T treeNode : treeNodes) {
            if(rootNode.getId().equals(treeNode.getParentId())) {
                rootNode.getChildren().add(findChildren(treeNodes, treeNode));
            }
        }
        return rootNode;
    }

    /**
     * 构建树节点
     */
    public static <T extends TreeVO> List<T> build(List<T> treeNodes) {
        List<T> result = new ArrayList<>();

        //list转map
        Map<String, T> nodeMap = new LinkedHashMap<>(treeNodes.size());
        for(T treeNode : treeNodes){
            nodeMap.put(treeNode.getId(), treeNode);
        }

        for(T node : nodeMap.values()) {
            T parent = nodeMap.get(node.getParentId());
            if(parent != null && !(node.getId().equals(parent.getParentId()))){
                parent.getChildren().add(node);
                continue;
            }

            result.add(node);
        }

        return result;
    }
}

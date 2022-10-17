

package com.srm.common.util.tree;

import com.google.common.collect.Lists;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


public class TreeCodeUtils {
    /**
     * 根据pid，构建树节点
     */
    public static <T extends TreeCodeVO> List<T> build(List<T> treeNodes, String pid) {
        //pid不能为空
        List<T> treeList = new ArrayList<>();
        for(T treeNode : treeNodes) {
            String parentCode = treeNode.getParentCode();
            if (StringUtils.isEmpty(parentCode) || pid.equals(parentCode)) {
                treeList.add(findChildren(treeNodes, treeNode));
            }
        }

        return treeList;
    }

    /**
     * 查找子节点
     */
    private static <T extends TreeCodeVO> T findChildren(List<T> treeNodes, T rootNode) {
        for(T treeNode : treeNodes) {
            if(rootNode.getCode().equals(treeNode.getParentCode())) {
                rootNode.getChildren().add(findChildren(treeNodes, treeNode));
            }
        }
        return rootNode;
    }

    /**
     * 构建树节点
     */
    public static <T extends TreeCodeVO> List<T> build(List<T> treeNodes) {
        List<T> result = new ArrayList<>();

        //list转map
        Map<String, T> nodeMap = new LinkedHashMap<>(treeNodes.size());
        for(T treeNode : treeNodes){
            nodeMap.put(treeNode.getCode(), treeNode);
        }

        for(T node : nodeMap.values()) {
            T parent = nodeMap.get(node.getParentCode());
            if(parent != null && !(node.getCode().equals(parent.getParentCode()))){
                parent.getChildren().add(node);
                continue;
            }

            result.add(node);
        }

        return result;
    }

    /**
     * 添加到子树上
     * @param list
     * @param tcdCodeMap
     */
    public static <T extends TreeCodeVO> void addSub(List<T> list, Map<String, List<T>> tcdCodeMap) {
        if(CollectionUtils.isEmpty(list)) return;

        for (TreeCodeVO treeCodeDTO : list) {
            if(tcdCodeMap == null) break;

            String code = treeCodeDTO.getCode();
            List<T> pums = tcdCodeMap.get(code);
            List<TreeCodeVO> children = treeCodeDTO.getChildren();

            if(CollectionUtils.isEmpty(pums) && CollectionUtils.isEmpty(children))
                continue;

            if(CollectionUtils.isEmpty(children))
                children = new ArrayList<>();

            //将子集添加到树节点上
            if(!CollectionUtils.isEmpty(pums)){
                children.addAll(pums);
                treeCodeDTO.setChildren(children);

                //移除掉已经挂载的子集数据
                tcdCodeMap.remove(code);
            }

            addSub((List<T>) children, tcdCodeMap);
        }
    }

    /**
     * 根据名称过滤数据
     * @param treeNodes
     * @param name
     * @return
     */
    public static <T extends TreeCodeVO> List<T> filterNode(List<T> treeNodes, String name) {
        //name为空时不过滤数据
        if(StringUtils.isEmpty(name)) return treeNodes;
        if(CollectionUtils.isEmpty(treeNodes)) return null;

        List<TreeCodeVO> subObject = new ArrayList<>();
        subObject.addAll(treeNodes);

        TreeCodeVO treeDTO = new TreeCodeVO();
        treeDTO.setChildren(subObject);

        return filterNode((T)treeDTO, name);
    }

    /**
     * 根据名称过滤数据
     * @param treeNode
     * @param name
     * @return
     */
    public static <T extends TreeCodeVO> List<T> filterNode(T treeNode, String name) {
        List<TreeCodeVO> nodes = treeNode.getChildren();
        List<T> newNodes = Lists.newArrayList();
        List<TreeCodeVO> tagNodes = Lists.newArrayList();

        if(CollectionUtils.isEmpty(nodes)) return newNodes;

        for (TreeCodeVO obj : nodes) {
            T node = (T)obj;

            if (node.getChildren() != null && node.getChildren().size() > 0) {
                List<TreeCodeVO> retNodes = filterNode(node, name);
                if (retNodes.size() > 0) {
                    node.setChildren(retNodes);
                    newNodes.add(node);
                    continue;
                } else {
                    // 没有子节点情况
                    node.setChildren(null);
                    // 标记,循环结束后删除
                    tagNodes.add(node);
                }
            }else{
                tagNodes.add(node);
            }

            //判断是否包含搜索的字段
            String nodeName = node.getName();
            if(!StringUtils.isEmpty(nodeName) && nodeName.indexOf(name) >= 0){
                newNodes.add(node);
            }
        }
        nodes.removeAll(tagNodes);
        return newNodes;
    }
}

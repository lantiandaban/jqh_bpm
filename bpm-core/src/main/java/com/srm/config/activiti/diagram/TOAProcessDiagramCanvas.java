

package com.srm.config.activiti.diagram;

import org.activiti.bpmn.model.AssociationDirection;
import org.activiti.image.impl.DefaultProcessDiagramCanvas;

import java.awt.*;
import java.awt.geom.Line2D;
import java.awt.geom.RoundRectangle2D;

/**
 * <p> </p>
 *
 * @author sog
 * @version 1.0
 * @since JDK 1.7
 */
public class TOAProcessDiagramCanvas extends DefaultProcessDiagramCanvas {
    private static Color HIGHLIGHT_COLOR = new Color(0, 167, 85);

    public TOAProcessDiagramCanvas(int width, int height, int minX, int minY, String imageType,
                                   String activityFontName, String labelFontName,
                                   String annotationFontName, ClassLoader customClassLoader) {
        super(width, height, minX, minY, imageType, activityFontName,
                labelFontName, annotationFontName, customClassLoader);
        initialize(imageType);
    }


    public void drawConnection(int[] xPoints, int[] yPoints, boolean conditional, boolean isDefault, String connectionType,
                               AssociationDirection associationDirection, boolean highLighted, double scaleFactor) {

        Paint originalPaint = g.getPaint();
        Stroke originalStroke = g.getStroke();

        g.setPaint(CONNECTION_COLOR);
        if (connectionType.equals("association")) {
            g.setStroke(ASSOCIATION_STROKE);
        } else if (highLighted) {
            g.setPaint(HIGHLIGHT_COLOR);
            g.setStroke(HIGHLIGHT_FLOW_STROKE);
        }

        for (int i = 1; i < xPoints.length; i++) {
            Integer sourceX = xPoints[i - 1];
            Integer sourceY = yPoints[i - 1];
            Integer targetX = xPoints[i];
            Integer targetY = yPoints[i];
            Line2D.Double line = new Line2D.Double(sourceX, sourceY, targetX, targetY);
            g.draw(line);
        }

        if (isDefault) {
            Line2D.Double line = new Line2D.Double(xPoints[0], yPoints[0], xPoints[1], yPoints[1]);
            drawDefaultSequenceFlowIndicator(line, scaleFactor);
        }

        if (conditional) {
            Line2D.Double line = new Line2D.Double(xPoints[0], yPoints[0], xPoints[1], yPoints[1]);
            drawConditionalSequenceFlowIndicator(line, scaleFactor);
        }

        if (associationDirection.equals(AssociationDirection.ONE) || associationDirection.equals(AssociationDirection.BOTH)) {
            Line2D.Double line = new Line2D.Double(xPoints[xPoints.length - 2], yPoints[xPoints.length - 2], xPoints[xPoints.length - 1], yPoints[xPoints.length - 1]);
            drawArrowHead(line, scaleFactor);
        }
        if (associationDirection.equals(AssociationDirection.BOTH)) {
            Line2D.Double line = new Line2D.Double(xPoints[1], yPoints[1], xPoints[0], yPoints[0]);
            drawArrowHead(line, scaleFactor);
        }
        g.setPaint(originalPaint);
        g.setStroke(originalStroke);
    }

    @Override
    public void drawHighLight(int x, int y, int width, int height) {
        Paint originalPaint = g.getPaint();
        Stroke originalStroke = g.getStroke();
        g.setPaint(HIGHLIGHT_COLOR);
        g.setStroke(THICK_TASK_BORDER_STROKE);
        RoundRectangle2D rect = new RoundRectangle2D.Double(x, y, width, height, 20, 20);
        g.draw(rect);
        g.setPaint(originalPaint);
        g.setStroke(originalStroke);
    }

    /**
     * 扩展设置流程节点的处理问题，最后一个当前运行节点为高亮节点
     *
     * @param x      位置x
     * @param y      位置y
     * @param width  宽度
     * @param height 高度
     */
    public void drawLastNode(int x, int y, int width, int height) {
        Paint originalPaint = g.getPaint();
        Stroke originalStroke = g.getStroke();
        g.setPaint(Color.RED);
        g.setStroke(THICK_TASK_BORDER_STROKE);
        RoundRectangle2D rect = new RoundRectangle2D.Double(x, y, width, height, 20, 20);
        g.draw(rect);
        g.setPaint(originalPaint);
        g.setStroke(originalStroke);
    }
}

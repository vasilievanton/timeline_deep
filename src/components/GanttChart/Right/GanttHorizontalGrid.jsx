/**
 * GanttHorizontalGrid
 *
 * Рисует горизонтальные разделительные линии только для задач с level > 0
 *
 * @param g - D3 selection группы
 * @param y - шкала по Y
 * @param rightWidth - ширина диаграммы
 * @param tasks - массив задач
 * @param theme - тема
 */
const GanttHorizontalGrid = (g, y, rightWidth, tasks, theme, topOffset = 50) => {
    // ✅ Фильтруем только задачи level > 0 (без подзаголовков)
    const taskRows = tasks.filter(t => t.level > 0);
  
    g.selectAll(".horizontal-grid-line")
      .data(taskRows)
      .enter()
      .append("line")
      .attr("class", "horizontal-grid-line")
      .attr("x1", 0)
      .attr("x2", rightWidth)
      .attr("y1", d => y(d.name))
      .attr("y2", d => y(d.name))
      .attr("stroke", theme.palette.grey[300])
      .attr("stroke-width", 0.5)
      .attr("shape-rendering", "crispEdges");
  };
  
  export default GanttHorizontalGrid;
  
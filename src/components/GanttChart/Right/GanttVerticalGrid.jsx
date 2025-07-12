import * as d3 from 'd3';

/**
 * GanttVerticalGrid
 *
 * @param g - D3 selection
 * @param x - шкала времени по X
 * @param minDate - минимальная дата
 * @param maxDate - максимальная дата
 * @param chartHeight - полная высота svg (включая шапки)
 * @param theme - тема (цвета)
 * @param tasks - массив задач (для фильтрации уровней)
 * @param rowHeight - высота одной строки
 */
const GanttVerticalGrid = (
  g,
  x,
  minDate,
  maxDate,
  chartHeight,
  theme,
  tasks,
  rowHeight
  , topOffset = 50
) => {
  // 1️⃣ Посчитаем количество видимых строк справа (level > 0)
  const taskRows = tasks.filter(t => t.level > 0).length;
  const gridHeight = taskRows * rowHeight;

  // 2️⃣ Генерируем все дни
  const allDays = d3.timeDay.range(
    d3.timeDay.floor(minDate),
    d3.timeDay.offset(maxDate, 1)
  );

  // 3️⃣ Рисуем только до gridHeight
  g.selectAll(".day-grid")
    .data(allDays)
    .enter()
    .append("line")
    .attr("class", "day-grid")
    .attr("x1", d => x(d))
    .attr("x2", d => x(d))
    .attr("y1", 0)
    .attr("y2", gridHeight)
    .attr("stroke", theme.palette.grey[300])
    .attr("stroke-width", 0.5)
    .attr("shape-rendering", "crispEdges");
};

export default GanttVerticalGrid;

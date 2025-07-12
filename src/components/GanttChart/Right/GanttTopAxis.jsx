import * as d3 from 'd3';

/**
 * GanttTopAxis - рисует верхнюю шкалу с датами (ось времени сверху диаграммы)
 *
 * @param g - D3 selection группы в SVG, куда добавляем ось
 * @param x - шкала времени по X
 * @param minDate - минимальная дата (начало оси)
 * @param maxDate - максимальная дата (конец оси)
 * @param theme - MUI theme (для цветов и шрифтов)
 * @param chartHeight - общая высота диаграммы (для позиционирования элементов)
 */
const GanttTopAxis = (g, x, minDate, maxDate, theme, chartHeight, topOffset = 50) => {
  // === Создаём явный список понедельников ===
  const mondayTicks = [];
  let currentMonday = d3.timeMonday.floor(minDate);
  while (currentMonday <= maxDate) {
    mondayTicks.push(new Date(currentMonday));  // копия!
    currentMonday = d3.timeMonday.offset(currentMonday, 1);
  }

  // === Создаём ось с фиксированными тиками ===
  const axis = d3
    .axisTop(x)
    .tickValues(mondayTicks)
    .tickFormat(d3.timeFormat('%d.%m'))
    .tickSize(20)
    .tickPadding(12);

  // === Добавляем группу оси в основной <g> ===
  const axisGroup = g
    .append('g')
    .attr('transform', 'translate(0, -10)')
    .call(axis);

  // === Стилизация текста тиков ===
  axisGroup
    .selectAll('text')
    .style('font-weight', 'bold')
    .style('font-size', '16px')
    .attr('dx', '30px')
    .attr('dy', '1.5em');

  // === Стилизация засечек ===
  axisGroup
    .selectAll('line')
    .attr('stroke', theme.palette.text.primary)
    .attr('stroke-width', 2);

  // === Удаляем линию под тикетами ===
  axisGroup.selectAll('.domain').remove();
  axisGroup.selectAll('path').remove();
};

export default GanttTopAxis;

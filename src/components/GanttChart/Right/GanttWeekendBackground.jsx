import * as d3 from 'd3';

/**
 * Рисует розовый фон только под выходные (СБ и ВС).
 * @param g - основная группа
 * @param x - шкала времени
 * @param minDate - начало диапазона
 * @param maxDate - конец диапазона
 * @param chartHeight - высота графика
 * @param theme - тема (для цветов)
 */
const GanttWeekendBackground = (g, x, minDate, maxDate, chartHeight, theme) => {
  // Список всех дней в диапазоне
  const allDays = d3.timeDay.range(
    d3.timeDay.floor(minDate),
    d3.timeDay.offset(maxDate, 1)
  );

  // Фильтруем только выходные
  const weekendDays = allDays.filter(d => d.getDay() === 0 || d.getDay() === 6);

  // Рисуем для них фоновый прямоугольник
  g.selectAll(".weekend-bg")
    .data(weekendDays)
    .enter()
    .append("rect")
    .attr("class", "weekend-bg")
    .attr("x", d => x(d))
    .attr("y", 0)
    .attr("width", d => x(d3.timeDay.offset(d, 1)) - x(d))
    .attr("height", chartHeight)
    .attr("fill", theme.palette.mode === 'dark' ? '#4a0026' : '#ffe6e6')
    .attr("opacity", 0.5);
};

export default GanttWeekendBackground;

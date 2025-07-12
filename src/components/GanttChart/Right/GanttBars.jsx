import * as d3 from 'd3';
import { timeDay } from 'd3-time';
import { RESPONSIBLE_COLORS } from '../utils/constants';

/**
 * GanttBars - рендерит все "блоки задач" на диаграмме
 * @param g - D3 selection группы в SVG, куда рисовать
 * @param x - шкала времени по X
 * @param y - шкала по задачам по Y
 * @param tasks - массив задач
 * @param theme - MUI тема для цветов
 * @param onEdit - функция обработки клика на задаче
 */
const GanttBars = (g, x, y, tasks, theme, onEdit) => {
  const minTextWidth = 80;

  const filteredTasks = tasks.filter(d => d.level !== 0 && d.start && d.end);

  const taskGroups = g
    .selectAll('.task-bar-group')
    .data(filteredTasks)
    .enter()
    .append('g')
    .attr('class', 'task-bar-group')
    .attr('transform', (d) => {
      const yPos = y(d.name) + (y.step() - y.bandwidth()) / 2;
      const xPos = x(timeDay.floor(d.start));
      return `translate(${xPos}, ${yPos})`;
    });

  taskGroups
    .each(function (d) {
      const group = d3.select(this);

      const startDate = timeDay.floor(d.start);
      const endDate = timeDay.offset(timeDay.floor(d.end), 1);
      const barWidth = Math.max(2, x(endDate) - x(startDate));
      const barHeight = y.bandwidth();

      group
        .append('rect')
        .attr('width', barWidth)
        .attr('height', barHeight)
        .attr('fill', () => {
          if (d.responsibles && d.responsibles.length) {
            if (d.responsibles[0] === 'Deep') return '#0037C2';
            if (d.responsibles[0] === 'MTC') return '#FF0032';
          }
          return theme.palette.grey[500];
        })
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('opacity', 1)
        .on('mouseover', function () {
          group.selectAll('.hover-text, .hover-bg')
            .transition().duration(200)
            .style('opacity', 1);
        })
        .on('mouseout', function () {
          group.selectAll('.hover-text, .hover-bg')
            .transition().duration(200)
            .style('opacity', 0);
        })
        .on('click', () => onEdit && onEdit(d));

      const label = `${d3.timeFormat('%d.%m')(d.start)} - ${d3.timeFormat('%d.%m')(d.end)}`;

      if (barWidth >= minTextWidth) {
        group
          .append('text')
          .attr('class', 'hover-text')
          .text(label)
          .attr('x', barWidth / 2)
          .attr('y', barHeight / 2 + 4)
          .style('text-anchor', 'middle')
          .style('font', '12px sans-serif')
          .style('fill', theme.palette.common.white)
          .style('pointer-events', 'none')
          .style('opacity', 0);
      } else {
        const bgHeight = 20;
        const bgWidth = 90;

        group
          .append('rect')
          .attr('class', 'hover-bg')
          .attr('x', (barWidth - bgWidth) / 2)
          .attr('y', -bgHeight - 5)
          .attr('width', bgWidth)
          .attr('height', bgHeight)
          .attr('fill', theme.palette.grey[800])
          .attr('rx', 4)
          .attr('ry', 4)
          .style('opacity', 0);

        group
          .append('text')
          .attr('class', 'hover-text')
          .text(label)
          .attr('x', barWidth / 2)
          .attr('y', -bgHeight / 2 - 5 + 6)
          .style('text-anchor', 'middle')
          .style('font', '12px sans-serif')
          .style('fill', theme.palette.common.white)
          .style('pointer-events', 'none')
          .style('opacity', 0);
      }
    });
};

export default GanttBars;

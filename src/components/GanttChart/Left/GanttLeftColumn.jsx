import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useTheme } from '@mui/material/styles';
import { wrapText } from '../utils/d3Helpers';
import { ROW_HEIGHT, BAND_PADDING } from '../utils/constants';

const GanttLeftColumn = ({ tasks, containerWidth, onEditTask }) => {
  const svgRef = useRef();
  const theme = useTheme();

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    const leftWidth = containerWidth * 0.25;

    // === Разворачиваем approval в отдельные элементы для отрисовки ===
    const expandedTasks = [];
    for (const t of tasks) {
      expandedTasks.push(t);
      if (t.approval) {
        expandedTasks.push({
          name: `${t.name} - согласование`,
          level: 2,
        });
      }
    }

    const chartHeight = expandedTasks.length * ROW_HEIGHT;

    const y = d3
      .scaleBand()
      .domain(expandedTasks.map((d) => d.name))
      .range([0, chartHeight])
      .padding(BAND_PADDING);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .attr('width', leftWidth)
      .attr('height', chartHeight + 100)
      .append('g')
      .attr('transform', 'translate(0,50)');

    // === Фон для блоков (level 0) ===
    g.selectAll('.block-bg')
      .data(expandedTasks.filter((d) => d.level === 0))
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (d) => y(d.name))
      .attr('width', leftWidth)
      .attr('height', y.step())
      .attr('fill', '#eeeeee');

    // === Тексты ===
    g.selectAll('.task-label')
      .data(expandedTasks)
      .enter()
      .append('text')
      .text((d) => d.name)
      .attr('x', (d) => 10 + (d.level || 0) * 20)
      .attr('y', (d) => y(d.name) + y.bandwidth() / 2 + 5)
      .style('font-size', '14px')
      .style('font-weight', (d) => (d.level === 0 ? 'bold' : 'normal'))
      .style('fill', theme.palette.text.primary)
      .style('alignment-baseline', 'middle')
      .style('cursor', 'pointer') // курсор
      .on('click', (event, d) => onEditTask(d)) // <<< добавляем кликабельность
      .call(wrapText, leftWidth - 40);
  }, [tasks, containerWidth, theme, onEditTask]);

  return <svg ref={svgRef}></svg>;
};

export default GanttLeftColumn;

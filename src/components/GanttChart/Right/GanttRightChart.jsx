import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useTheme } from '@mui/material/styles';
import { makeScales } from '../utils/d3Helpers';
import { ROW_HEIGHT } from '../utils/constants';

import GanttWeekendBackground from './GanttWeekendBackground';
import GanttBlockBackground from './GanttBlockBackground';
import GanttVerticalGrid from './GanttVerticalGrid';
import GanttHorizontalGrid from './GanttHorizontalGrid';
import GanttBars from './GanttBars';
import GanttTopAxis from './GanttTopAxis';

const GanttRightChart = ({ tasks, containerWidth, onEditTask }) => {
  const svgRef = useRef();
  const theme = useTheme();
  const TOP_OFFSET = 50;

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    // === Подготовка данных для отрисовки ===
    const expandedTasks = [];
    for (const t of tasks) {
      expandedTasks.push(t);
      if (t.approval) {
        expandedTasks.push({
          index: `${t.index}-approval`, // ✅ это ключевое!
          name: `${t.name} - согласование`,
          start: t.approval.start,
          end: t.approval.end,
          responsibles: t.approval.responsibles,
          level: 2,
        });
      }
    }

    const rightWidth = Math.max(containerWidth * 0.75, 2000);
    const chartHeight = expandedTasks.length * ROW_HEIGHT;

    // === Найти диапазон дат
    const datedTasks = expandedTasks.filter((t) => t.start && t.end);
    if (datedTasks.length === 0) return;

    let rawMinDate = d3.min(datedTasks, (d) => d.start);
    let rawMaxDate = d3.max(datedTasks, (d) => d.end);

    const minDate = d3.timeMonday.floor(rawMinDate);
    const maxDate = d3.timeSunday.ceil(rawMaxDate);

    const { x, y } = makeScales(expandedTasks, rightWidth, chartHeight, minDate, maxDate);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .attr('width', rightWidth)
      .attr('height', chartHeight + 100)
      .append('g')
      .attr('transform', 'translate(0,50)');
    console.log(
      'expandedTasks',
      expandedTasks.map((t) => t.name)
    );

    GanttWeekendBackground(g, x, minDate, maxDate, chartHeight, theme, TOP_OFFSET);
    GanttBlockBackground(g, y, rightWidth, expandedTasks, theme, TOP_OFFSET);
    GanttVerticalGrid(g, x, minDate, maxDate, chartHeight, theme, expandedTasks, ROW_HEIGHT, TOP_OFFSET);
    GanttHorizontalGrid(g, y, rightWidth, expandedTasks, theme, TOP_OFFSET);
    GanttBars(g, x, y, expandedTasks, theme, onEditTask, TOP_OFFSET);
    GanttTopAxis(g, x, minDate, maxDate, theme, chartHeight, TOP_OFFSET);
  }, [tasks, containerWidth, theme, onEditTask]);

  return <svg ref={svgRef}></svg>;
};

export default GanttRightChart;

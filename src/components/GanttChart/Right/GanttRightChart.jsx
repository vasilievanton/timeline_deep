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

const GanttRightChart = ({ rows, responsibles, containerWidth, onEditTask }) => {
  const svgRef = useRef();
  const theme = useTheme();
  const TOP_OFFSET = 50;
  console.log('GANTTRIGHT: rows prop received:', rows);
  useEffect(() => {
    if (!rows || rows.length === 0) return;
  

    // ✅ гарантированно конвертируем строки в Date
    rows.forEach((row) => {
      if (typeof row.start === 'string') row.start = new Date(row.start);
      if (typeof row.end === 'string') row.end = new Date(row.end);
    });
  

    const rightWidth = Math.max(containerWidth * 0.75, 2000);
    const chartHeight = rows.length * ROW_HEIGHT;
  
    const datedTasks = rows.filter((t) => t.start && t.end);

  
    if (!datedTasks || datedTasks.length === 0) {
      console.warn('No dated tasks to render');
      return;
    }
  
    let rawMinDate = d3.min(datedTasks, (d) => d.start);
    let rawMaxDate = d3.max(datedTasks, (d) => d.end);
  
    const minDate = d3.timeMonday.floor(rawMinDate);
    const maxDate = d3.timeSunday.ceil(rawMaxDate);
  
    console.log('RIGHT CHART - minDate:', minDate);
    console.log('RIGHT CHART - maxDate:', maxDate);
  
    const { x, y } = makeScales(rows, rightWidth, chartHeight, minDate, maxDate);
  
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
  
    const g = svg
      .attr('width', rightWidth)
      .attr('height', chartHeight + 100)
      .append('g')
      .attr('transform', `translate(0,${TOP_OFFSET})`);
  
    GanttWeekendBackground(g, x, minDate, maxDate, chartHeight, theme, TOP_OFFSET);
    GanttBlockBackground(g, y, rightWidth, rows, theme, TOP_OFFSET);
    GanttVerticalGrid(g, x, minDate, maxDate, chartHeight, theme, rows, ROW_HEIGHT, TOP_OFFSET);
    GanttHorizontalGrid(g, y, rightWidth, rows, theme, TOP_OFFSET);
    GanttBars(g, x, y, rows, theme, onEditTask, TOP_OFFSET);
    GanttTopAxis(g, x, minDate, maxDate, theme, chartHeight, TOP_OFFSET);
  }, [rows, responsibles, containerWidth, theme, onEditTask]);
  

  return <svg ref={svgRef}></svg>;
};

export default GanttRightChart;

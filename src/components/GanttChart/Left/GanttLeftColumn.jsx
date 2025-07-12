import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useTheme } from '@mui/material/styles';
import { wrapText } from '../utils/d3Helpers';
import { ROW_HEIGHT, BAND_PADDING } from '../utils/constants';

const GanttLeftColumn = ({ rows, containerWidth, onEditTask }) => {
  const svgRef = useRef();
  const theme = useTheme();

  useEffect(() => {
    if (!rows || rows.length === 0) return;

    const leftWidth = containerWidth * 0.25;
    const chartHeight = rows.length * ROW_HEIGHT;

    const y = d3
      .scaleBand()
      .domain(rows.map((d) => d.name))
      .range([0, chartHeight])
      .padding(BAND_PADDING);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .attr('width', leftWidth)
      .attr('height', chartHeight + 100)
      .append('g')
      .attr('transform', 'translate(0,50)');

    g.selectAll('.block-bg')
      .data(rows.filter((d) => d.level === 0))
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (d) => y(d.name))
      .attr('width', leftWidth)
      .attr('height', y.step())
      .attr('fill', '#eeeeee');

    g.selectAll('.task-label')
      .data(rows)
      .enter()
      .append('text')
      .text((d) => d.name)
      .attr('x', (d) => 10 + (d.level || 0) * 20)
      .attr('y', (d) => y(d.name) + y.bandwidth() / 2 + 5)
      .style('font-size', '14px')
      .style('font-weight', (d) => (d.level === 0 ? 'bold' : 'normal'))
      .style('fill', theme.palette.text.primary)
      .style('alignment-baseline', 'middle')
      .style('cursor', (d) => (d.level > 0 ? 'pointer' : 'default'))
      .on('click', (event, d) => {
        if (d.level > 0) {
          onEditTask(d);
        }
      })
      .call(wrapText, leftWidth - 40);
  }, [rows, containerWidth, theme, onEditTask]);

  return <svg ref={svgRef}></svg>;
};

export default GanttLeftColumn;

const GanttBlockBackground = (g, y, rightWidth, tasks, theme, topOffset = 50) => {
  // Только level = 0
  const blocks = tasks.filter((d) => Number(d.level) === 0);

  g.selectAll('.block-bg-right')
    .data(blocks)
    .enter()
    .append('rect')
    .attr('class', 'block-bg-right')
    .attr('x', 0)
    .attr('y', (d) => y(d.name))
    .attr('width', rightWidth)
    .attr('height', y.step())
    .attr('fill', theme.palette.grey[200]);
};

export default GanttBlockBackground;

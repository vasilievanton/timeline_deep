import React, { useRef, useState, useEffect } from 'react';
import GanttLeftColumn from './Left/GanttLeftColumn';
import GanttRightChart from './Right/GanttRightChart';
import './GanttChart.css';

const GanttChart = ({ rows, responsibles, onEditTask }) => {
  const containerRef = useRef();
  const [containerWidth, setContainerWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ❤️ Отладочный лог
  console.log('GANTTCHART: received rows prop:', rows);

  return (
    <div className="gantt-container" ref={containerRef}>
      <div className="gantt-scroll-area">
        <div className="gantt-left">
          <GanttLeftColumn
            rows={rows}
            containerWidth={containerWidth}
            onEditTask={onEditTask}
          />
        </div>
        <div className="gantt-right-scroll">
          <GanttRightChart
            rows={rows}
            responsibles={responsibles}
            containerWidth={containerWidth}
            onEditTask={onEditTask}
          />
        </div>
      </div>
    </div>
  );
};

export default GanttChart;

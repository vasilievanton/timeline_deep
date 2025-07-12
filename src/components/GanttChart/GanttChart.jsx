import React, { useRef, useState, useEffect } from 'react';
import GanttLeftColumn from './Left/GanttLeftColumn';
import GanttRightChart from './Right/GanttRightChart';
import './GanttChart.css';

const GanttChart = ({ tasks, onEditTask }) => {
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

  return (
    <div className="gantt-container" ref={containerRef}>
      <div className="gantt-scroll-area">
        <div className="gantt-left">
          <GanttLeftColumn tasks={tasks} containerWidth={containerWidth} onEditTask={onEditTask} />
        </div>
        <div className="gantt-right-scroll">
          <GanttRightChart tasks={tasks} containerWidth={containerWidth} onEditTask={onEditTask} />
        </div>
      </div>
    </div>
  );
};

export default GanttChart;

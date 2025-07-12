import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import GanttChart from './components/GanttChart/GanttChart';
import TaskEditModal from './components/TaskForm/TaskEditModal';
import TaskAddModal from './components/TaskForm/TaskAddModal';
import sampleTasks from './data/sampleTasks';
import sampleBlocks from './data/sampleBlocks';
import sampleResponsibles from './data/sampleResponsibles';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(sampleTasks);
  const [blocks, setBlocks] = useState(sampleBlocks);
  const [responsibles, setResponsibles] = useState(sampleResponsibles);
  const [expandedRows, setExpandedRows] = useState([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  
  const buildExpandedRows = () => {
    const toDate = (d) => (typeof d === 'string' ? new Date(d) : d);
  
    const rows = [];
  
    for (const block of blocks) {
      rows.push({
        level: 0,
        name: block.name,
        index: block.index,
      });
  
      const blockTasks = tasks.filter((t) => t.headingIndex === block.index);
      for (const t of blockTasks) {
        rows.push({
          ...t,
          level: 1,
          start: toDate(t.start),
          end: toDate(t.end),
        });
  
        if (t.approval) {
          rows.push({
            index: `${t.index}-approval`,
            name: `${t.name} - согласование`,
            start: toDate(t.approval.start),
            end: toDate(t.approval.end),
            responsibles: t.approval.responsibles,
            level: 2,
          });
        }
      }
    }
  
    return rows;
  };
  

  useEffect(() => {
    const built = buildExpandedRows();
    console.log('=== EXPANDED ROWS BUILT ===', JSON.stringify(built, null, 2));
    setExpandedRows(built);
  }, [tasks, blocks]);
  

  const handleDeleteTask = (taskToDelete) => {
    setTasks((prev) => prev.filter((t) => t.index !== taskToDelete.index));
    setEditModalOpen(false);
  };

  const handleSaveEditedTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.index === updatedTask.index ? updatedTask : t))
    );
    setEditModalOpen(false);
  };

  const handleSaveNewTask = (newTask) => {
    setTasks((prev) => {
      const newIndex = Math.max(...prev.map((t) => t.index), 0) + 1;
      newTask.index = newIndex;
      return [...prev, newTask];
    });
    setAddModalOpen(false);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  };
  console.log('APP: passing expandedRows to GanttChart:', expandedRows);

  return (
    <div className="App">
      <header>
        <Typography variant="h4" component="h1">
          Диаграмма Ганта проекта
        </Typography>
        <div style={{ marginTop: '10px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setAddModalOpen(true)}
          >
            + Добавить задачу
          </Button>
        </div>
      </header>

      <main>
        
        <GanttChart
          rows={expandedRows}
          responsibles={responsibles}
          onEditTask={handleEditTask}
        />
      </main>

      <section
        style={{
          marginTop: '20px',
          padding: '10px',
          background: '#f5f5f5',
          border: '1px solid #ddd',
          maxHeight: '400px',
          overflow: 'auto',
        }}
      >
        <Typography variant="h6">DEBUG JSON:</Typography>
        <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(expandedRows, null, 2)}
        </pre>
      </section>

      <TaskAddModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveNewTask}
        blocks={blocks}
        responsibles={responsibles}
      />

      <TaskEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEditedTask}
        onDelete={handleDeleteTask}
        task={selectedTask}
        blocks={blocks}
        availableResponsibles={responsibles}
      />
    </div>
  );
}

export default App;

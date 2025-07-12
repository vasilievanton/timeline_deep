import React, { useState } from 'react';
import Papa from 'papaparse';
import { parseCSVData } from './components/GanttChart/utils/parseTasks';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import GanttChart from './components/GanttChart/GanttChart';
import TaskEditModal from './components/TaskForm/TaskEditModal';
import TaskAddModal from './components/TaskForm/TaskAddModal';
import sampleTasks from './data/sampleTasks';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { addDays } from 'date-fns';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(sampleTasks);
  const [debugJSON, setDebugJSON] = useState('');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  console.log(tasks);
  // === Автоматически рассчитываем даты для approval
  const calculateApprovalDates = (task) => {
    if (task.approval && task.approval.duration && task.end) {
      task.approval.start = addDays(task.end, 1);
      task.approval.end = addDays(task.end, task.approval.duration);
    } else if (task.approval) {
      // если duration удалили, убираем start/end
      delete task.approval.start;
      delete task.approval.end;
    }
    return task;
  };

  // === Удаление задачи
  const handleDeleteTask = (taskToDelete) => {
    setTasks((prev) => prev.filter((t) => t.index !== taskToDelete.index));
    setEditModalOpen(false);
  };

  // === Сохранение редактирования
  const handleSaveEditedTask = (updatedTask) => {
    updatedTask = calculateApprovalDates(updatedTask);
    setTasks((prev) =>
      prev.map((t) => {
        if (t.index !== updatedTask.index) return t;
        return {
          ...updatedTask,
          approval: updatedTask.approval ? { ...updatedTask.approval } : undefined,
        };
      })
    );
    setEditModalOpen(false);
  };

  // === Добавление новой задачи
  const handleSaveNewTask = (newTask) => {
    newTask = calculateApprovalDates(newTask);
    setTasks((prev) => {
      const newIndex = Math.max(...prev.map((t) => t.index), 0) + 1;
      newTask.index = newIndex;
      return [...prev, newTask];
    });
    setAddModalOpen(false);
  };

  // === Редактирование
  const handleEditTask = (task) => {
    if (typeof task.index === 'string' && task.index.includes('-approval')) {
      const parentIndex = parseInt(task.index.split('-')[0], 10);
      const parentTask = tasks.find((t) => t.index === parentIndex);
      if (parentTask) {
        setSelectedTask(parentTask);
        setEditModalOpen(true);
      }
    } else {
      setSelectedTask(task);
      setEditModalOpen(true);
    }
  };

  // === Импорт CSV
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsed = parseCSVData(result.data);
        console.log('Parsed tasks:', parsed);
        setTasks(parsed);
        setDebugJSON(JSON.stringify(parsed, null, 2));
      },
    });
  };

  // === Экспорт CSV
  const handleExportCSV = () => {
    if (!tasks || tasks.length === 0) return;

    const rows = tasks.map((t) => ({
      'Название задачи': t.name,
      'Дата начала': t.start ? new Date(t.start).toISOString().split('T')[0] : '',
      'Дата конца': t.end ? new Date(t.end).toISOString().split('T')[0] : '',
      Ответственные: t.responsibles ? t.responsibles.join('; ') : '',
      'Срок согласования': t.approval ? t.approval.duration : '',
    }));

    const csv = Papa.unparse(rows);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'exported_tasks.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // === PDF
  const handleDownloadPDF = () => {
    const element = document.querySelector('.gantt-container');
    if (!element) return;
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('gantt.pdf');
    });
  };

  return (
    <div className="App">
      <header>
        <Typography variant="h4" component="h1">
          Диаграмма Ганта проекта
        </Typography>
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="csv-upload">
            <input accept=".csv" id="csv-upload" type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
            <Button variant="contained" component="span">
              Импорт CSV
            </Button>
          </label>
          <Button variant="contained" color="success" onClick={handleExportCSV} style={{ marginLeft: '10px' }}>
            Экспорт CSV
          </Button>
          <Button variant="contained" color="primary" onClick={() => setAddModalOpen(true)} style={{ marginLeft: '10px' }}>
            + Добавить задачу
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleDownloadPDF} style={{ marginLeft: '10px' }}>
            Скачать PDF
          </Button>
        </div>
      </header>

      <main>
        <GanttChart tasks={tasks} onEditTask={handleEditTask} />
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
        <Typography variant="h6">DEBUG JSON (копируй для sampleTasks.js):</Typography>
        <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>{debugJSON}</pre>
      </section>

      <TaskAddModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onSave={handleSaveNewTask} />

      <TaskEditModal open={editModalOpen} onClose={() => setEditModalOpen(false)} onSave={handleSaveEditedTask} onDelete={handleDeleteTask} task={selectedTask} blocks={tasks.filter((t) => t.level === 0)} availableResponsibles={['Deep', 'MTC']} />
    </div>
  );
}

export default App;

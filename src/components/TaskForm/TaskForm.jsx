import React, { useState, useEffect } from 'react';
import { TextField, Grid, Checkbox, FormControlLabel, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ru } from 'date-fns/locale';
import { addDays, differenceInCalendarDays } from 'date-fns';

const TaskForm = ({ mode, task, onSave, onClose }) => {
  // Инициализация состояния
  const [name, setName] = useState('');
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [days, setDays] = useState('');
  const [responsibles, setResponsibles] = useState('');
  const [hasApproval, setHasApproval] = useState(false);
  const [approvalDuration, setApprovalDuration] = useState('');

  useEffect(() => {
    if (mode === 'edit' && task) {
      setName(task.name || '');
      setStart(task.start || null);
      setEnd(task.end || null);
      setResponsibles(task.responsibles ? task.responsibles.join(', ') : '');
      setDays(task.days || '');
      setHasApproval(!!task.approvalDuration);
      setApprovalDuration(task.approvalDuration || '');
    } else {
      setName('');
      setStart(null);
      setEnd(null);
      setDays('');
      setResponsibles('');
      setHasApproval(false);
      setApprovalDuration('');
    }
  }, [mode, task]);

  useEffect(() => {
    if (start && end) {
      const diff = differenceInCalendarDays(end, start) + 1;
      if (diff > 0 && days !== diff) {
        setDays(diff);
      }
    }
  }, [start, end]);
  

  // ======== Автоматическая связка дней и дат
  const handleStartChange = (date) => {
    setStart(date);
    if (date && days && days > 0) {
      setEnd(addDays(date, days - 1));
    }
  };

  const handleEndChange = (date) => {
    setEnd(date);
    if (start && date) {
      const diff = differenceInCalendarDays(date, start) + 1;
      setDays(diff > 0 ? diff : '');
    }
  };

  const handleDaysChange = (val) => {
    const value = parseInt(val, 10);
    setDays(value >= 1 ? value : '');
    if (start && value >= 1) {
      setEnd(addDays(start, value - 1));
    }
  };

  // ======== Сохранение
  const handleSave = () => {
    if (!name || !start || !end) {
      alert('Заполните название и даты');
      return;
    }
    if (end < start) {
      alert('Дата окончания не может быть раньше даты начала');
      return;
    }

    const result = {
      name,
      start,
      end,
      responsibles: responsibles
        ? responsibles
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      level: 1,
      approvalDuration: hasApproval ? Math.max(1, parseInt(approvalDuration) || 1) : undefined,
    };

    onSave(result);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {/* 1. Название */}
        <Grid item xs={12}>
          <TextField fullWidth label="Название задачи" value={name} onChange={(e) => setName(e.target.value)} />
        </Grid>

        {/* 2. Дата начала */}
        <Grid item xs={12}>
          <DatePicker label="Дата начала" value={start} onChange={handleStartChange} renderInput={(params) => <TextField fullWidth {...params} />} />
        </Grid>

        {/* 3. Дата окончания и Количество дней */}
        <Grid item xs={6}>
          <DatePicker label="Дата окончания" value={end} onChange={handleEndChange} renderInput={(params) => <TextField fullWidth {...params} />} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth type="number" label="Количество дней" value={days || ''} onChange={(e) => handleDaysChange(e.target.value)} helperText="Заполните одно из полей" />
        </Grid>

        {/* 4. Ответственные */}
        <Grid item xs={12}>
          <TextField fullWidth label="Ответственные (через запятую)" value={responsibles} onChange={(e) => setResponsibles(e.target.value)} />
        </Grid>

        {/* 5. Чекбокс + Срок согласования */}
        <Grid item xs={12}>
          <FormControlLabel control={<Checkbox checked={hasApproval} onChange={(e) => setHasApproval(e.target.checked)} />} label="Требуется согласование" />
        </Grid>

        {hasApproval && (
          <Grid item xs={12}>
            <TextField type="number" fullWidth label="Срок согласования (дней)" value={approvalDuration || ''} onChange={(e) => setApprovalDuration(Math.max(1, parseInt(e.target.value) || 1))} />
          </Grid>
        )}

        {/* 6. Кнопки */}
        <Grid item xs={12} container justifyContent="flex-end" spacing={2}>
          <Grid item>
            <Button onClick={onClose}>Отмена</Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleSave}>
              Сохранить
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default TaskForm;

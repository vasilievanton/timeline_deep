import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Checkbox, FormControlLabel, MenuItem, Select
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ru } from 'date-fns/locale';
import { addDays, differenceInCalendarDays } from 'date-fns';

const TaskAddModal = ({ open, onClose, onSave, blocks = [], availableResponsibles = ['Deep', 'MTC'] }) => {
  const [newTask, setNewTask] = useState({
    name: '',
    blockIndex: '',
    start: null,
    end: null,
    days: 1,
    responsibles: [],
    approval: null
  });

  const handleStartChange = (date) => {
    setNewTask((prev) => {
      let end = prev.end;
      if (date && prev.days && prev.days > 0) {
        end = addDays(date, prev.days - 1);
      }
      return { ...prev, start: date, end };
    });
  };

  const handleEndChange = (date) => {
    setNewTask((prev) => {
      let days = prev.days;
      if (prev.start && date) {
        days = differenceInCalendarDays(date, prev.start) + 1;
      }
      return { ...prev, end: date, days };
    });
  };

  const handleDaysChange = (value) => {
    const days = Math.max(1, parseInt(value, 10) || 1);
    setNewTask((prev) => {
      if (!prev.start) return { ...prev, days };
      const end = addDays(prev.start, days - 1);
      return { ...prev, days, end };
    });
  };

  const toggleResponsible = (name) => {
    setNewTask((prev) => {
      const current = prev.responsibles || [];
      const updated = current.includes(name)
        ? current.filter((r) => r !== name)
        : [...current, name];
      return { ...prev, responsibles: updated };
    });
  };

  const toggleApprovalResponsible = (name) => {
    setNewTask((prev) => {
      if (!prev.approval) return prev;
      const current = prev.approval.responsibles || [];
      const updated = current.includes(name)
        ? current.filter((r) => r !== name)
        : [...current, name];
      return {
        ...prev,
        approval: { ...prev.approval, responsibles: updated },
      };
    });
  };

  const handleSave = () => {
    if (!newTask.name.trim()) return;
    if (!newTask.start || !newTask.end) return;
    onSave(newTask);
    setNewTask({
      name: '',
      blockIndex: '',
      start: null,
      end: null,
      days: 1,
      responsibles: [],
      approval: null
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Добавить новую задачу</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название задачи"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Select
                fullWidth
                value={newTask.blockIndex || ''}
                onChange={(e) => setNewTask({ ...newTask, blockIndex: e.target.value })}
                displayEmpty
              >
                <MenuItem value="" disabled>Выберите блок</MenuItem>
                {blocks.map((b) => (
                  <MenuItem key={b.index} value={b.index}>{b.name}</MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12}>
              <DatePicker
                label="Дата начала"
                value={newTask.start}
                onChange={handleStartChange}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>

            <Grid item xs={6}>
              <DatePicker
                label="Дата окончания"
                value={newTask.end}
                onChange={handleEndChange}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Количество дней"
                value={newTask.days}
                onChange={(e) => handleDaysChange(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <div>
                <div>Ответственные:</div>
                {availableResponsibles.map((name) => (
                  <Button
                    key={name}
                    variant={newTask.responsibles.includes(name) ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => toggleResponsible(name)}
                    sx={{ m: 0.5 }}
                  >
                    {name}
                  </Button>
                ))}
              </div>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!newTask.approval}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        approval: e.target.checked
                          ? { duration: 1, responsibles: [] }
                          : null,
                      })
                    }
                  />
                }
                label="Требуется согласование"
              />
            </Grid>

            {newTask.approval && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Срок согласования (дней)"
                    value={newTask.approval.duration || ''}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        approval: {
                          ...newTask.approval,
                          duration: Math.max(1, parseInt(e.target.value) || 1),
                        },
                      })
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <div>
                    <div>Ответственные за согласование:</div>
                    {availableResponsibles.map((name) => (
                      <Button
                        key={name}
                        variant={newTask.approval.responsibles?.includes(name) ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => toggleApprovalResponsible(name)}
                        sx={{ m: 0.5 }}
                      >
                        {name}
                      </Button>
                    ))}
                  </div>
                </Grid>
              </>
            )}
          </Grid>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={handleSave}>Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskAddModal;

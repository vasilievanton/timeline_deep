import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Checkbox, FormControlLabel,
  Select, MenuItem
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ru } from 'date-fns/locale';
import { addDays, differenceInCalendarDays } from 'date-fns';

const TaskEditModal = ({
  open,
  onClose,
  onSave,
  onDelete,
  task,
  blocks,
  availableResponsibles
}) => {
  const [localTask, setLocalTask] = useState(null);

  useEffect(() => {
    if (task) {
      let days = task.days;
      if ((!days || isNaN(days)) && task.start && task.end) {
        days = differenceInCalendarDays(new Date(task.end), new Date(task.start)) + 1;
      }
      setLocalTask({
        ...task,
        blockIndex: task.headingIndex != null ? String(task.headingIndex) : '',
        days
      });
    }
  }, [task]);

  if (!localTask) return null;

  const handleStartChange = (date) => {
    setLocalTask((prev) => {
      if (!prev) return prev;
      let end = prev.end;
      let days = prev.days;
      if (date && end) {
        days = differenceInCalendarDays(end, date) + 1;
      } else if (date && days && days > 0) {
        end = addDays(date, days - 1);
      }
      return { ...prev, start: date, end, days };
    });
  };

  const handleEndChange = (date) => {
    setLocalTask((prev) => {
      if (!prev) return prev;
      let days = prev.days;
      if (prev.start && date) {
        days = differenceInCalendarDays(date, prev.start) + 1;
      }
      return { ...prev, end: date, days };
    });
  };

  const handleDaysChange = (value) => {
    const days = Math.max(1, parseInt(value, 10) || 1);
    setLocalTask((prev) => {
      if (!prev.start) return { ...prev, days };
      const end = addDays(prev.start, days - 1);
      return { ...prev, days, end };
    });
  };

  const toggleResponsible = (id) => {
    setLocalTask((prev) => {
      const current = prev.responsibles || [];
      const updated = current.includes(id) ? current.filter((r) => r !== id) : [...current, id];
      return { ...prev, responsibles: updated };
    });
  };

  const toggleApprovalResponsible = (id) => {
    setLocalTask((prev) => {
      if (!prev.approval) return prev;
      const current = prev.approval.responsibles || [];
      const updated = current.includes(id) ? current.filter((r) => r !== id) : [...current, id];
      return {
        ...prev,
        approval: { ...prev.approval, responsibles: updated },
      };
    });
  };

  const handleApprovalChange = (field, value) => {
    setLocalTask((prev) => ({
      ...prev,
      approval: { ...prev.approval, [field]: value },
    }));
  };

  const handleSave = () => {
    const { blockIndex, ...rest } = localTask;
    onSave({
      ...rest,
      headingIndex: blockIndex !== '' ? parseInt(blockIndex, 10) : null
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Редактирование задачи</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
          <Grid container spacing={2} sx={{ mt: 1 }}>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название задачи"
                value={localTask.name ?? ''}
                onChange={(e) => setLocalTask({ ...localTask, name: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Select
                fullWidth
                value={localTask.blockIndex}
                onChange={(e) => setLocalTask({ ...localTask, blockIndex: e.target.value })}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Выберите блок
                </MenuItem>
                {blocks.map((b) => (
                  <MenuItem key={String(b.index)} value={String(b.index)}>
                    {b.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12}>
              <DatePicker
                label="Дата начала"
                value={localTask.start || null}
                onChange={handleStartChange}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>

            <Grid item xs={6}>
              <DatePicker
                label="Дата окончания"
                value={localTask.end || null}
                onChange={handleEndChange}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Количество дней"
                value={localTask.days ?? ''}
                onChange={(e) => handleDaysChange(e.target.value)}
                helperText="Заполните одно из полей"
              />
            </Grid>

            <Grid item xs={12}>
              <div>
                <div>Ответственные:</div>
                {availableResponsibles.map((person) => (
                  <Button
                    key={person.id}
                    variant={localTask.responsibles?.includes(person.id) ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => toggleResponsible(person.id)}
                    sx={{ m: 0.5 }}
                  >
                    {person.name}
                  </Button>
                ))}
              </div>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!localTask.approval}
                    onChange={(e) =>
                      setLocalTask({
                        ...localTask,
                        approval: e.target.checked
                          ? {
                              duration: 1,
                              responsibles: availableResponsibles[0]
                                ? [availableResponsibles[0].id]
                                : [],
                            }
                          : undefined,
                      })
                    }
                  />
                }
                label="Требуется согласование"
              />
            </Grid>

            {localTask.approval && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Срок согласования (дней)"
                    value={localTask.approval.duration ?? ''}
                    onChange={(e) =>
                      handleApprovalChange('duration', Math.max(1, parseInt(e.target.value) || 1))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <div>
                    <div>Ответственные за согласование:</div>
                    {availableResponsibles.map((person) => (
                      <Button
                        key={person.id}
                        variant={localTask.approval.responsibles?.includes(person.id) ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => toggleApprovalResponsible(person.id)}
                        sx={{ m: 0.5 }}
                      >
                        {person.name}
                      </Button>
                    ))}
                  </div>
                </Grid>
              </>
            )}
          </Grid>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button
          variant="text"
          color="error"
          size="small"
          onClick={() => onDelete && onDelete(localTask)}
        >
          Удалить задачу
        </Button>
        <div>
          <Button onClick={onClose}>Отмена</Button>
          <Button variant="contained" onClick={handleSave}>
            Сохранить
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default TaskEditModal;

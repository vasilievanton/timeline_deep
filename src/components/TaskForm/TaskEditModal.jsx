import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import TaskForm from './TaskForm';

const TaskEditModal = ({ open, onClose, onSave, task }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>Редактирование задачи</DialogTitle>
    <DialogContent>
      <TaskForm mode="edit" task={task} onSave={onSave} onClose={onClose} />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Отмена</Button>
    </DialogActions>
  </Dialog>
);

export default TaskEditModal;

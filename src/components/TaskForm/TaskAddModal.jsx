import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import TaskForm from './TaskForm';

const TaskAddModal = ({ open, onClose, onSave }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>Добавить задачу</DialogTitle>
    <DialogContent>
      <TaskForm mode="add" onSave={onSave} onClose={onClose} />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Отмена</Button>
    </DialogActions>
  </Dialog>
);

export default TaskAddModal;

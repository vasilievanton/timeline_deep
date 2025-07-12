// ResponsiblesManager.jsx

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ResponsiblesManager = ({ open, onClose, responsibles, onAdd, onDelete }) => {
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    if (newName.trim() !== '') {
      onAdd(newName.trim());
      setNewName('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Управление исполнителями</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Добавить нового исполнителя
        </Typography>
        <TextField
          fullWidth
          label="Имя исполнителя"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleAdd();
          }}
        />
        <Button variant="contained" onClick={handleAdd} sx={{ mt: 2 }}>
          Добавить
        </Button>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Существующие исполнители
        </Typography>
        <List>
          {responsibles.map((name) => (
            <ListItem
              key={name}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(name)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={name} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResponsiblesManager;

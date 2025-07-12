// BlocksManager.jsx

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

const BlocksManager = ({ open, onClose, blocks, onAdd, onDelete }) => {
  const [newBlockName, setNewBlockName] = useState('');

  const handleAdd = () => {
    if (newBlockName.trim() !== '') {
      onAdd(newBlockName.trim());
      setNewBlockName('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Управление блоками (разделами)</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Добавить новый блок
        </Typography>
        <TextField
          fullWidth
          label="Название блока"
          value={newBlockName}
          onChange={(e) => setNewBlockName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleAdd();
          }}
        />
        <Button variant="contained" onClick={handleAdd} sx={{ mt: 2 }}>
          Добавить
        </Button>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Существующие блоки
        </Typography>
        <List>
          {blocks.map((block) => (
            <ListItem
              key={block.index}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(block)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={block.name} />
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

export default BlocksManager;

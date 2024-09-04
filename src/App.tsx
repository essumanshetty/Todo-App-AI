import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton,
  Paper,
  Box,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Indigo
    },
    secondary: {
      main: '#f50057', // Pink
    },
    background: {
      default: '#f5f5f5', // Light grey
      paper: '#ffffff', // White
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

interface Todo {
  id: number;
  text: string;
  completed: boolean;  // Add this line
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setTodos([...todos, { id: Date.now(), text: inputValue.trim(), completed: false }]);
      setInputValue('');
    }
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  const handleUpdate = (id: number, newText: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: newText.trim() } : todo
    ));
    setEditingId(null);
  };

  const handleToggleComplete = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ padding: '20px' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Todo App
            </Typography>
            <Box sx={{ mb: 2 }}>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (editingId !== null) {
                  handleUpdate(editingId, inputValue);
                } else {
                  handleSubmit(e);
                }
              }} style={{ display: 'flex', gap: '10px' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder={"Enter a new todo"}
                />
                <Tooltip title={"Add Todo"}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    type="submit"
                    sx={{
                      minWidth: 'unset',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    <AddIcon />
                  </Button>
                </Tooltip>
              </form>
            </Box>
            <List>
              {todos.map(todo => (
                <Box key={todo.id} sx={{ mb: 2 }}>
                  <Paper elevation={2}>
                    <ListItem sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {editingId === todo.id ? (
                        <TextField
                          fullWidth
                          defaultValue={todo.text}
                          onBlur={(e) => handleUpdate(todo.id, e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdate(todo.id, (e.target as HTMLInputElement).value);
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <ListItemText 
                          primary={todo.text} 
                          onClick={() => handleEdit(todo.id)}
                          sx={{ 
                            cursor: 'pointer',
                            textDecoration: todo.completed ? 'line-through' : 'none'
                          }}
                        />
                      )}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Mark as completed">
                          <IconButton
                            edge="end"
                            aria-label="complete"
                            onClick={() => handleToggleComplete(todo.id)}
                            color="primary"
                          >
                            <CheckCircleOutlineIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                          <IconButton 
                            edge="end" 
                            aria-label="delete" 
                            onClick={() => handleDelete(todo.id)}
                            color="secondary"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </ListItem>
                  </Paper>
                </Box>
              ))}
            </List>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;

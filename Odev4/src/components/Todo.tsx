import { Box, Button, Typography } from '@mui/material'
import { useState } from 'react';
import { todo, todoInput } from '../interfaces'
import { useStateContext } from '../state-manager/stateProvider';
import { TodoForm } from './TodoForm';

interface TodoProps {
  todo: todo;
}

export const Todo: React.FC<TodoProps> = ({ todo }) => {
  const [editing, setEditing] = useState(false);

  const startEdit = () => { setEditing(true) };
  const cancelEdit = () => { setEditing(false) };
  const saveEdit = (updatedTodo: todoInput) => {
    stateManager.updateTodo(updatedTodo, todo.id)
      .then(() => { setEditing(false) });
  };

  const stateManager = useStateContext()!;
  const editValues = { title: todo.title, categoryId: todo.categoryId, statusId: todo.statusId }
  const color = stateManager.state.statuses.get(todo.statusId)?.color;

  return (
    <>
      {
        editing ?
          <TodoForm type='edit' saveEdit={saveEdit} cancelEdit={cancelEdit} initialValue={editValues} /> :
          <Box sx={{ outline: `2px solid ${color}`, display: 'flex', alignItems: 'center', m: '16px', ':hover': { backgroundColor: 'rgb(230,230,230)' } }}>
            <Box sx={{ flex: '0px 1 1' }}>
              <Typography sx={{ px: '14px' }}>{todo.title}</Typography>
            </Box>
            <Box sx={{ flex: '0px 1 1', ml: '10px' }}>
              <Typography sx={{ px: '14px' }}>{stateManager.state.categories.get(todo.categoryId)?.title}</Typography>
            </Box>
            <Box sx={{ flex: '0px 1 1', ml: '10px' }}>
              <Typography sx={{ px: '14px' }}>{stateManager.state.statuses.get(todo.statusId)?.title}</Typography>
            </Box>
            <Box sx={{ flex: '100px 0 0', ml: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Button onClick={startEdit}>Edit</Button>
              <Button onClick={() => { stateManager.deleteTodo(todo.id) }}>Delete</Button>
            </Box>
          </Box>
      }
    </>
  )
}
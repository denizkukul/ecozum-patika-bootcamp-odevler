import { Box, Typography } from '@mui/material'
import { useState } from 'react';
import { Todo, TodoForm } from '../components'
import { useStateContext } from '../state-manager/stateProvider'

export const TodosPage: React.FC = () => {
  const [filter, setFilter] = useState({ title: '', categoryId: 0, statusId: 0 });
  const stateManager = useStateContext()!;

  const getFilteredTodos = () => {
    if (Object.values(filter).every(value => value === '' || value === 0)) {
      return [...stateManager.state.todos.values()];
    }
    else return [...stateManager.state.todos.values()].filter(todo => {
      return todo.title.includes(filter.title) &&
        (filter.categoryId === 0 || todo.categoryId === filter.categoryId) &&
        (filter.statusId === 0 || todo.statusId === filter.statusId)
    })
  }

  return (
    <>
      <Typography sx={{ pl: '16px', borderBottom: '1px solid black', my: '5px' }}>Add Todo</Typography>
      <TodoForm type='add' addTodo={stateManager.addTodo} />
      <Typography sx={{ pl: '16px', borderBottom: '1px solid black', my: '5px' }}>Filter Todos</Typography>
      <TodoForm type='filter' setFilter={setFilter} />
      <Typography sx={{ pl: '16px', borderBottom: '1px solid black', my: '5px' }}>Todo List</Typography>
      <Box>
        {
          getFilteredTodos().map((todo) => {
            return (<Todo todo={todo} key={todo.id} />)
          })
        }
      </Box>
    </>
  )
}
import { CategoryForm } from '../components';
import { Category } from '../components';
import { Box, Button, Typography } from '@mui/material';
import { useStateContext } from '../state-manager/stateProvider';
import { useState } from 'react';
import { categoryInput } from '../interfaces';

export const CategoriesPage: React.FC = () => {
  const [adding, setAdding] = useState(false);
  const stateManager = useStateContext()!;
  stateManager.getCategoryList();

  const startAdd = () => { setAdding(true) }
  const cancelAdd = () => { setAdding(false) }
  const addCategory = (newCategory: categoryInput) => {
    stateManager.addCategory(newCategory);
    setAdding(false);
  }

  return (
    <>
      {
        adding && <CategoryForm type='add' cancelAdd={cancelAdd} addCategory={addCategory} />
      }
      <Box sx={{ borderBottom: '1px solid black', display: 'flex', alignItems: 'center', pb: '5px' }}>
        <Typography sx={{ pl: '16px' }}>Category List</Typography>
        <Button sx={{ ml: 'auto', mr: 0, p: '6px 16px' }} onClick={startAdd}>Add Category</Button>
      </Box>
      <Box>
        {
          [...stateManager.state.categories.values()].map((category) => {
            return (
              <Category category={category} key={category.id} />
            )
          })
        }
      </Box>
    </>
  )
}
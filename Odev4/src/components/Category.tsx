import { Box, Button, Typography } from '@mui/material'
import { useState } from 'react';
import { category, categoryInput } from '../interfaces'
import { useStateContext } from '../state-manager/stateProvider';
import { CategoryForm } from './CategoryForm';
import { Modal } from './Modal';

interface categoryProps {
  category: category;
}

export const Category: React.FC<categoryProps> = ({ category }) => {
  const [editing, setEditing] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const stateManager = useStateContext()!;


  const startEdit = () => {
    stateManager.getStatusList(category.id)
      .then(() => setEditing(true));
  };
  const cancelEdit = () => { setEditing(false) };
  const saveEdit = (updatedCategory: categoryInput) => {
    stateManager.updateCategory(updatedCategory, category.id)
      .then(() => setEditing(false));
  };

  const getEditValues = () => {
    const statuses = category.statusIDs.map(statusID => { return stateManager.state.statuses.get(statusID)! });
    const editValues = { title: category.title, statuses: statuses };
    return editValues;
  }

  return (
    <>
      {
        editing && <CategoryForm type='edit' initialValue={getEditValues()} saveEdit={saveEdit} cancelEdit={cancelEdit} />
      }
      {
        deleteModal &&
        <Modal>
          <Typography sx={{ textAlign: 'center', mt: 2 }}>Deleteing a category will remove all related todos!</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button onClick={() => stateManager.deleteCategory(category.id)}>Confirm</Button>
            <Button sx={{ ml: 5 }} onClick={() => setDeleteModal(false)}>Cancel</Button>
          </Box>
        </Modal>
      }
      <Box sx={{ display: 'flex', alignItems: 'center', p: '8px 16px', ":hover": { backgroundColor: 'rgb(230,230,230)' } }}>
        <Box><Typography>{category.title}</Typography></Box>
        <Button sx={{ ml: 'auto' }} onClick={startEdit}>Edit</Button>
        <Button onClick={() => setDeleteModal(true)}>Delete</Button>
      </Box>
    </>
  )
}
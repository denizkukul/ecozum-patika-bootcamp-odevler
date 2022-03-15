import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { categoryInput } from '../interfaces';
import AddIcon from '@mui/icons-material/Add';
import { Modal } from './Modal';
import { useStateContext } from '../state-manager/stateProvider';

interface CategoryFormProps {
  type: 'add' | 'edit' | 'filter';
  initialValue?: categoryInput;
  addCategory?: (category: categoryInput) => void;
  saveEdit?: (category: categoryInput) => void;
  cancelEdit?: () => void;
  cancelAdd?: () => void;
}

const colors = ['blue', 'red', 'green', 'orange', 'yellow', 'purple']

export const CategoryForm: React.FC<CategoryFormProps> = ({ type, initialValue, addCategory, saveEdit, cancelEdit, cancelAdd }) => {
  const [formData, setFormData] = useState<categoryInput>(initialValue ? initialValue : { title: '', statuses: [{ title: '', color: '' }] });

  const updateCategoryTitle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((previousState) => { return { ...previousState, title: e.target.value } });
  }
  const updateStatusTitle = (index: number, value: string) => {
    let newStatuses = formData.statuses.slice();
    newStatuses[index].title = value;
    setFormData((previousState) => { return { ...previousState, statuses: newStatuses } })
  }
  const updateStatusColor = (index: number, value: string) => {
    let newStatuses = formData.statuses.slice();
    newStatuses[index].color = value;
    setFormData((previousState) => { return { ...previousState, statuses: newStatuses } })
  }

  const addStatus = () => {
    let newStatuses = formData.statuses.slice();
    newStatuses.push({ title: '', color: '' })
    setFormData((current) => { return { ...current, statuses: newStatuses } })
  }

  const removeStatus = (index: number) => {
    let newStatuses = formData.statuses.slice();
    newStatuses.splice(index, 1)
    setFormData((current) => { return { ...current, statuses: newStatuses } })
  }

  const handleAddCategory = () => {
    if (!validate()) return;
    addCategory && addCategory(formData);
  }

  const handleSaveEdit = () => {
    if (!validate()) return;
    saveEdit && saveEdit(formData);
  }

  const validate = () => {
    if (formData.title === '') return false;
    if (formData.statuses.some(status => status.title === '')) return false;
    return true;
  }

  return (
    <Modal>
      <TextField sx={{ width: '380px', mb: 3 }} name='category-title' value={formData.title} onChange={updateCategoryTitle} label='Category Name' />
      {
        formData.statuses.map((status, index) => {
          return (
            <Box key={index} sx={{ display: 'flex', mb: 3 }}>
              <TextField sx={{ width: '380px' }} value={status.title} onChange={(e) => updateStatusTitle(index, e.target.value)} label='Status Name' />
              <FormControl sx={{ width: '150px', ml: 3 }}>
                <InputLabel id={`Status${index}`}>Status Color</InputLabel>
                <Select value={status.color} onChange={(e) => updateStatusColor(index, e.target.value)} labelId={`Status${index}`} label='Status Color'>
                  {
                    colors.map((color, i) => {
                      return (
                        <MenuItem value={color} key={i}><Typography sx={{ textTransform: 'capitalize' }}>{color}</Typography></MenuItem>
                      )
                    })
                  }
                </Select>
              </FormControl>
              {
                formData.statuses.length > 1 &&
                <Button sx={{ ml: 'auto' }} onClick={() => removeStatus(index)}>Remove</Button>
              }
            </Box>
          )
        })
      }
      <Button sx={{ mb: 3, height: '50px', minWidth: '50px', width: '50px', borderRadius: '100%' }} onClick={addStatus}>
        <AddIcon sx={{ height: '40px', width: '40px' }} />
      </Button>
      {
        type === 'edit' &&
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleSaveEdit}>Save</Button>
          <Button onClick={() => cancelEdit && cancelEdit()}>Cancel</Button>
        </Box>
      }
      {
        type === 'add' &&
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleAddCategory}>Add</Button>
          <Button onClick={() => cancelAdd && cancelAdd()}>Cancel</Button>
        </Box>
      }
    </Modal>
  )
}
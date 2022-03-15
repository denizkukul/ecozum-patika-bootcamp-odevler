import { Box, TextField, Select, SelectChangeEvent, Button, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import { todoInput } from '../interfaces';
import { useStateContext } from '../state-manager/stateProvider';

interface TodoFormProps {
  type: 'add' | 'edit' | 'filter';
  initialValue?: todoInput;
  addTodo?: (todo: todoInput) => void;
  saveEdit?: (todo: todoInput) => void;
  cancelEdit?: () => void;
  setFilter?: React.Dispatch<React.SetStateAction<todoInput>>
}

export const TodoForm: React.FC<TodoFormProps> = ({ type, initialValue, saveEdit, cancelEdit, addTodo, setFilter }) => {
  const [formData, setFormData] = useState<todoInput>(initialValue ? initialValue : { title: '', categoryId: 0, statusId: 0 });
  const updateFormData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<number>) => {
    if (e.target.name === 'categoryId') {
      setFilter && setFilter((previousState) => { return { ...previousState, [e.target.name]: e.target.value, statusId: 0 } })
      setFormData((previousState) => { return { ...previousState, [e.target.name]: e.target.value, statusId: 0 } });
      return
    }
    setFilter && setFilter((previousState) => { return { ...previousState, [e.target.name]: e.target.value } })
    setFormData((previousState) => { return { ...previousState, [e.target.name]: e.target.value } });
  };

  const stateManager = useStateContext()!;

  const clearFormData = () => {
    let newValue = { title: '', categoryId: 0, statusId: 0 };
    setFormData(newValue);
    setFilter && setFilter(newValue);
  }

  const handleAddTodo = () => {
    if (!validate()) return;
    addTodo && addTodo(formData);
    clearFormData();
  }

  const handleSaveEdit = () => {
    if (!validate()) return;
    saveEdit && saveEdit(formData);
  }

  const getStatuses = () => {
    if (formData.categoryId === 0) return;
    stateManager.getStatusList(formData.categoryId)
  }

  const renderCategoryOptions = () => {
    if (stateManager.allCategoriesFetched.current) {
      return [...stateManager.state.categories.values()].map((category, i) => {
        return <MenuItem value={category.id} key={i}>{category.title}</MenuItem>
      })
    }
  };

  const renderStatusOptions = () => {
    let currentCategory = stateManager.state.categories.get(formData.categoryId);
    if (!currentCategory?.allStatusesFetched) return
    return currentCategory.statusIDs.map((statusID, i) => {
      return <MenuItem value={statusID} key={i}>{stateManager.state.statuses.get(statusID)?.title}</MenuItem>
    })
  }

  const validate = () => {
    if (formData.title === '') return false;
    if (formData.statusId === 0) return false;
    if (formData.categoryId === 0) return false;
    return true
  }




  return (
    <Box sx={{ m: '16px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField sx={{ flex: '0px 1 1' }} value={formData.title} label='Todo Name' name='title' onChange={updateFormData} />
        <FormControl sx={{ flex: '0px 1 1', ml: '10px' }}>
          <InputLabel id='Category'>Category</InputLabel>
          <Select value={formData.categoryId} labelId='Category' label='Category' name='categoryId' onMouseDown={stateManager.getCategoryList} onChange={updateFormData}>
            <MenuItem value={0} disabled>{'Category'}</MenuItem>
            {renderCategoryOptions()}
          </Select>
        </FormControl>
        <FormControl sx={{ flex: '0px 1 1', ml: '10px' }}>
          <InputLabel id='Status'>Status</InputLabel>
          <Select value={formData.statusId} labelId='Status' label='Status' name='statusId' onMouseDown={getStatuses} onChange={updateFormData}>
            <MenuItem value={0} disabled>{'Status'}</MenuItem>
            {renderStatusOptions()}
          </Select>
        </FormControl>

        {
          type === 'add' &&
          <Button sx={{ flex: '100px 0 0', ml: '10px' }} onClick={handleAddTodo}>Add</Button>
        }
        {
          type === 'edit' &&
          <Box sx={{ flex: '100px 0 0', ml: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button onClick={handleSaveEdit}>Save</Button>
            <Button onClick={() => cancelEdit && cancelEdit()}>Cancel</Button>
          </Box>
        }
        {
          type === 'filter' &&
          <Button sx={{ flex: '100px 0 0', ml: '10px' }} onClick={clearFormData}>Clear</Button>
        }
      </Box>
    </Box>
  )
}
// components/CategoryForm.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { Category } from '../models/Category';

interface CategoryFormProps {
  initialValues?: Partial<Category>;
  onSubmit: (category: Omit<Category, 'id'>) => void;
  isSubmitting?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialValues, onSubmit, isSubmitting = false }) => {
  const [formValues, setFormValues] = useState({
    name: initialValues?.name || '',
    description: initialValues?.description || ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    description: ''
  });

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (!formValues.name.trim()) {
      newErrors.name = 'Category name is required';
      isValid = false;
    } else {
      newErrors.name = '';
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name: formValues.name,
        description: formValues.description
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        {initialValues?.id ? 'Edit Category' : 'Create New Category'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Category Name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          disabled={isSubmitting}
        />
        
        <TextField
          margin="normal"
          fullWidth
          id="description"
          label="Description (optional)"
          name="description"
          multiline
          rows={2}
          value={formValues.description}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (initialValues?.id ? 'Update Category' : 'Create Category')}
        </Button>
      </Box>
    </Paper>
  );
};

export default CategoryForm;
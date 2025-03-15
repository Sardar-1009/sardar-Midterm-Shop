
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText, 
  Typography,
  Paper
} from '@mui/material';
import { Listing } from '../models/Listing';
import { Category } from '../models/Category';
import { fetchCategories } from '../api/categoryService';

interface ListingFormProps {
  initialValues?: Partial<Listing>;
  onSubmit: (listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isSubmitting?: boolean;
}

const ListingForm: React.FC<ListingFormProps> = ({ initialValues, onSubmit, isSubmitting = false }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formValues, setFormValues] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    price: initialValues?.price ? initialValues.price.toString() : '',
    categoryId: initialValues?.categoryId || '',
    imageUrl: initialValues?.imageUrl || ''
  });
  
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrl: ''
  });

  useEffect(() => {
    const getCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
      

      if (initialValues?.categoryId && fetchedCategories.length > 0) {
        setFormValues(prev => ({
          ...prev,
          categoryId: initialValues.categoryId
        }));
      }
    };
    getCategories();
  }, [initialValues]);

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (!formValues.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    } else {
      newErrors.title = '';
    }
    
    if (!formValues.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    } else {
      newErrors.description = '';
    }
    
    if (!formValues.price.trim()) {
      newErrors.price = 'Price is required';
      isValid = false;
    } else if (isNaN(Number(formValues.price)) || Number(formValues.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
      isValid = false;
    } else {
      newErrors.price = '';
    }
    
    if (!formValues.categoryId) {
      newErrors.categoryId = 'Category is required';
      isValid = false;
    } else {
      newErrors.categoryId = '';
    }
    
    if (!formValues.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
      isValid = false;
    } else if (!isValidUrl(formValues.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
      isValid = false;
    } else {
      newErrors.imageUrl = '';
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
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
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        title: formValues.title,
        description: formValues.description,
        price: Number(formValues.price),
        categoryId: formValues.categoryId,
        imageUrl: formValues.imageUrl
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        {initialValues?.id ? 'Edit Listing' : 'Create New Listing'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          label="Listing Title"
          name="title"
          value={formValues.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          disabled={isSubmitting}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="description"
          label="Description"
          name="description"
          multiline
          rows={4}
          value={formValues.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
          disabled={isSubmitting}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="price"
          label="Price"
          name="price"
          type="number"
          inputProps={{ min: 0, step: "any" }}
          value={formValues.price}
          onChange={handleChange}
          error={!!errors.price}
          helperText={errors.price}
          disabled={isSubmitting}
        />
        
        <FormControl 
          fullWidth 
          margin="normal" 
          required 
          error={!!errors.categoryId}
        >
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="categoryId"
            name="categoryId"
            value={formValues.categoryId}
            label="Category"
            onChange={handleChange}
            disabled={isSubmitting}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          {errors.categoryId && <FormHelperText>{errors.categoryId}</FormHelperText>}
        </FormControl>
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="imageUrl"
          label="Image URL"
          name="imageUrl"
          value={formValues.imageUrl}
          onChange={handleChange}
          error={!!errors.imageUrl}
          helperText={errors.imageUrl || "Enter a URL for the listing image"}
          disabled={isSubmitting}
        />
        
        {formValues.imageUrl && !errors.imageUrl && (
          <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
            <img 
              src={formValues.imageUrl} 
              alt="Preview" 
              style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'contain' }} 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL';
              }}
            />
          </Box>
        )}
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (initialValues?.id ? 'Update Listing' : 'Create Listing')}
        </Button>
      </Box>
    </Paper>
  );
};

export default ListingForm;
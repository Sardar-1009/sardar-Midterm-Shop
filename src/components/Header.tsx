// components/Header.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import CategoryMenu from './CategoryMenu';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
          Lalafo Mini
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <CategoryMenu />
          <Button 
            component={Link} 
            to="/listings/new" 
            variant="contained" 
            color="secondary"
          >
            Create Listing
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

// components/CategoryMenu.tsx
import React, { useState, useEffect } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../api/categoryService';
import { Category } from '../models/Category';

const CategoryMenu: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const getCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    };
    getCategories();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        color="inherit"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Categories
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {categories.map((category) => (
          <MenuItem 
            key={category.id} 
            component={Link} 
            to={`/categories/${category.id}`}
            onClick={handleClose}
          >
            {category.name}
          </MenuItem>
        ))}
        <MenuItem 
          component={Link} 
          to="/admin/categories"
          onClick={handleClose}
          divider
        >
          Manage Categories
        </MenuItem>
      </Menu>
    </>
  );
};

export default CategoryMenu;

// components/ListingCard.tsx
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { Listing } from '../models/Listing';
import { formatPrice } from '../utils/formatters';

interface ListingCardProps {
  listing: Listing;
  categoryName?: string;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, categoryName }) => {
  return (
    <Card 
      component={Link} 
      to={`/listings/${listing.id}`}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        textDecoration: 'none',
        transition: '0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={listing.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={listing.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {listing.title}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            height: '3em', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {listing.description}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {formatPrice(listing.price)}
          </Typography>
          {categoryName && (
            <Chip 
              label={categoryName} 
              size="small" 
              color="secondary" 
              variant="outlined" 
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ListingCard;

// components/ListingForm.tsx
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography } from '@mui/material';
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
      
      // If we have initial values but no category selected yet, and categories are loaded
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
        type

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Divider, 
  Alert,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { fetchCategories } from '../api/categoryService';
import { Category } from '../models/Category';
import CategoryForm from '../components/CategoryForm';
import { createCategory } from '../api/categoryService';

const CategoriesManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  const fetchCategoriesData = async () => {
    setLoading(true);
    try {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (categoryData: Omit<Category, 'id'>) => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      await createCategory(categoryData);
      setSuccess('Category created successfully!');
      fetchCategoriesData(); 
    } catch (err) {
      console.error('Error creating category:', err);
      setError('Failed to create category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to Listings
      </Button>
      
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Manage Categories
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Create New Category
      </Typography>
      
      <CategoryForm 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting}
      />
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Existing Categories
      </Typography>
      
      <Paper elevation={3}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : categories.length > 0 ? (
          <List>
            {categories.map((category, index) => (
              <React.Fragment key={category.id}>
                <ListItem>
                  <ListItemText 
                    primary={category.name} 
                    secondary={category.description || 'No description'} 
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      component={Link}
                      to={`/admin/categories/${category.id}/edit`}
                    >
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < categories.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No categories available. Create your first category above.
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default CategoriesManagementPage;


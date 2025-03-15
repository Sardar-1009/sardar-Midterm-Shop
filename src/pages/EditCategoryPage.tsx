import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Alert, 
  CircularProgress 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchCategories, updateCategory } from '../api/categoryService';
import { Category } from '../models/Category';
import CategoryForm from '../components/CategoryForm';

const EditCategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;
      
      setLoading(true);
      try {
        const fetchedCategories = await fetchCategories();
        const foundCategory = fetchedCategories.find(cat => cat.id === categoryId);
        
        if (foundCategory) {
          setCategory(foundCategory);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        setError('Failed to load category. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleSubmit = async (categoryData: Omit<Category, 'id'>) => {
    if (!category) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await updateCategory({
        ...categoryData,
        id: category.id
      });
      navigate('/admin/categories');
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!category) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Category not found.
        </Alert>
        <Button
          component={Link}
          to="/admin/categories"
          startIcon={<ArrowBackIcon />}
        >
          Back to Categories
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        component={Link}
        to="/admin/categories"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to Categories
      </Button>
      
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Edit Category
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <CategoryForm 
        initialValues={category}
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting}
      />
    </Container>
  );
};

export default EditCategoryPage;
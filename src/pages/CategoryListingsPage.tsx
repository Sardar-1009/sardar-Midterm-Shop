
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Grid, Box, Skeleton, Button, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchListingsByCategory } from '../api/listingService';
import { fetchCategories } from '../api/categoryService';
import { Listing } from '../models/Listing';
import { Category } from '../models/Category';
import ListingCard from '../components/ListingCard';

const CategoryListingsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [listings, setListings] = useState<Listing[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return;
      
      setLoading(true);
      try {
        const [fetchedListings, fetchedCategories] = await Promise.all([
          fetchListingsByCategory(categoryId),
          fetchCategories()
        ]);
        
        setListings(fetchedListings);
        const currentCategory = fetchedCategories.find(cat => cat.id === categoryId);
        setCategory(currentCategory || null);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2 }}
          >
            Back to All Listings
          </Button>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {loading ? (
              <Skeleton width={200} />
            ) : (
              category ? `${category.name} Listings` : 'Category Not Found'
            )}
          </Typography>
          {!loading && category?.description && (
            <Typography variant="body1" color="text.secondary">
              {category.description}
            </Typography>
          )}
        </Box>
        <Button
          component={Link}
          to="/listings/new"
          variant="contained"
          color="primary"
          state={{ preselectedCategory: categoryId }}
        >
          Add New Listing
        </Button>
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      {loading ? (
        <Grid container spacing={3}>
          {Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ width: '100%' }}>
                <Skeleton variant="rectangular" width="100%" height={200} />
                <Box sx={{ pt: 1 }}>
                  <Skeleton width="80%" />
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : listings.length > 0 ? (
        <Grid container spacing={3}>
          {listings.map(listing => (
            <Grid item xs={12} sm={6} md={4} key={listing.id}>
              <ListingCard 
                listing={listing} 
                categoryName={category?.name} 
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No listings available in this category.
          </Typography>
          <Button
            component={Link}
            to="/listings/new"
            variant="contained"
            sx={{ mt: 2 }}
            state={{ preselectedCategory: categoryId }}
          >
            Create First Listing
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default CategoryListingsPage;
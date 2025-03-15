
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createListing } from '../api/listingService';
import { Listing } from '../models/Listing';
import ListingForm from '../components/ListingForm';

interface LocationState {
  preselectedCategory?: string;
}

const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { preselectedCategory } = (location.state as LocationState) || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (listingData: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const newListing = await createListing(listingData);
      navigate(`/listings/${newListing.id}`);
    } catch (err) {
      console.error('Error creating listing:', err);
      setError('Failed to create listing. Please try again.');
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
        Create New Listing
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <ListingForm 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting}
        initialValues={preselectedCategory ? { categoryId: preselectedCategory } : undefined}
      />
    </Container>
  );
};

export default CreateListingPage;


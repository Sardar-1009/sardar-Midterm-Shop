// pages/ListingDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Button, 
  Divider, 
  Skeleton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchListingById, deleteListing } from '../api/listingService';
import { fetchCategories } from '../api/categoryService';
import { Listing } from '../models/Listing';
import { Category } from '../models/Category';
import { formatPrice } from '../utils/formatters';

const ListingDetailPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!listingId) return;
      
      setLoading(true);
      try {
        const [fetchedListing, fetchedCategories] = await Promise.all([
          fetchListingById(listingId),
          fetchCategories()
        ]);
        
        if (fetchedListing) {
          setListing(fetchedListing);
          const currentCategory = fetchedCategories.find(cat => cat.id === fetchedListing.categoryId);
          setCategory(currentCategory || null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [listingId]);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!listing) return;
    
    setIsDeleting(true);
    try {
      await deleteListing(listing.id);
      setOpenDeleteDialog(false);
      navigate('/');
    } catch (error) {
      console.error('Error deleting listing:', error);
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Listings
        </Button>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" width="100%" height={400} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" width="80%" height={40} />
              <Skeleton variant="text" width="30%" height={30} sx={{ mt: 2 }} />
              <Skeleton variant="text" width="60%" height={30} sx={{ mt: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 2 }} />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }

  if (!listing) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Listings
        </Button>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            Listing Not Found
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            The listing you're looking for does not exist or has been removed.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to Listings
      </Button>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img 
              src={listing.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image'}
              alt={listing.title}
              style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Available';
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                {listing.title}
              </Typography>
              
              <Box>
                <Button
                  component={Link}
                  to={`/listings/${listing.id}/edit`}
                  startIcon={<EditIcon />}
                  variant="outlined"
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  onClick={handleDeleteClick}
                  startIcon={<DeleteIcon />}
                  variant="outlined"
                  color="error"
                >
                  Delete
                </Button>
              </Box>
            </Box>
            
            <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
              {formatPrice(listing.price)}
            </Typography>
            
            {category && (
              <Chip 
                label={category.name} 
                color="secondary" 
                variant="outlined" 
                component={Link}
                to={`/categories/${category.id}`}
                clickable
                sx={{ mt: 2 }}
              />
            )}
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {listing.description}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="body2" color="text.secondary">
              Listing ID: {listing.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Posted: {new Date(listing.createdAt).toLocaleDateString()}
            </Typography>
            {listing.updatedAt > listing.createdAt && (
              <Typography variant="body2" color="text.secondary">
                Last updated: {new Date(listing.updatedAt).toLocaleDateString()}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Listing</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this listing? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ListingDetailPage;
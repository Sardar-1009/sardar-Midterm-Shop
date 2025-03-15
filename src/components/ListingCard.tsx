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
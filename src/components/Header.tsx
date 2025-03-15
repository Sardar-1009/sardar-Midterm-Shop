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
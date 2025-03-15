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

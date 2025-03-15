import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import CategoryListingsPage from '../pages/CategoryListingsPage';
import ListingDetailPage from '../pages/ListingDetailPage';
import CreateListingPage from '../pages/CreateListingPage';
import EditListingPage from '../pages/EditListingPage';
import CategoriesManagementPage from '../pages/CategoriesManagementPage';
import EditCategoryPage from '../pages/EditCategoryPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/categories/:categoryId" element={<CategoryListingsPage />} />
      <Route path="/listings/:listingId" element={<ListingDetailPage />} />
      <Route path="/listings/new" element={<CreateListingPage />} />
      <Route path="/listings/:listingId/edit" element={<EditListingPage />} />
      <Route path="/admin/categories" element={<CategoriesManagementPage />} />
      <Route path="/admin/categories/:categoryId/edit" element={<EditCategoryPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRouter;

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ShopkeeperLayout from '@/components/shopkeeper/ShopkeeperLayout';
import CustomerLayout from '@/components/customer/CustomerLayout';
import AuthPage from '@/pages/AuthPage';

const Index = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <AuthPage />;

  if (user?.role === 'shopkeeper') return <ShopkeeperLayout />;
  return <CustomerLayout />;
};

export default Index;

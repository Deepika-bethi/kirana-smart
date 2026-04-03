import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import CustomerHome from './CustomerHome';
import CustomerSearch from './CustomerSearch';
import CustomerCart from './CustomerCart';
import CustomerProfile from './CustomerProfile';

type Tab = 'home' | 'search' | 'cart' | 'profile';

const CustomerLayout = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const { cart } = useStore();
  const { t } = useLanguage();
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <CustomerHome onNavigate={setActiveTab} />;
      case 'search': return <CustomerSearch />;
      case 'cart': return <CustomerCart />;
      case 'profile': return <CustomerProfile />;
    }
  };

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t('nav.home'), icon: <Home className="w-5 h-5" /> },
    { id: 'search', label: t('nav.search'), icon: <Search className="w-5 h-5" /> },
    { id: 'cart', label: t('nav.cart'), icon: <ShoppingCart className="w-5 h-5" /> },
    { id: 'profile', label: t('nav.profile'), icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="px-4 pt-4">
        {renderContent()}
      </motion.div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border">
        <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all relative ${activeTab === item.id ? 'text-primary' : 'text-muted-foreground'}`}>
              {item.icon}
              <span className="text-[10px] font-display font-semibold">{item.label}</span>
              {item.id === 'cart' && cartCount > 0 && (
                <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">{cartCount}</span>
              )}
              {activeTab === item.id && (
                <motion.div layoutId="activeTab" className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CustomerLayout;

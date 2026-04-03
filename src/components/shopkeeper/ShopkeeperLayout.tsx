import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, FileText, Bell, Receipt,
  LogOut, Menu, Wifi, WifiOff, Store
} from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import DashboardView from './DashboardView';
import InventoryView from './InventoryView';
import BillingView from './BillingView';
import TransactionsView from './TransactionsView';
import AlertsView from './AlertsView';

type Tab = 'dashboard' | 'inventory' | 'billing' | 'transactions' | 'alerts';

const ShopkeeperLayout = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isOffline, setIsOffline, getAIInsights } = useStore();
  const { t } = useLanguage();
  const alertCount = getAIInsights().filter(i => i.severity === 'critical').length;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'inventory', label: t('nav.inventory'), icon: <Package className="w-5 h-5" /> },
    { id: 'billing', label: t('nav.billing'), icon: <Receipt className="w-5 h-5" /> },
    { id: 'transactions', label: t('nav.transactions'), icon: <FileText className="w-5 h-5" /> },
    { id: 'alerts', label: t('nav.alerts'), icon: <Bell className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'inventory': return <InventoryView />;
      case 'billing': return <BillingView />;
      case 'transactions': return <TransactionsView />;
      case 'alerts': return <AlertsView />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-pink flex items-center justify-center">
              <Store className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-foreground leading-tight">Smart Inventory X</h2>
              <p className="text-xs text-muted-foreground">{t('nav.shopkeeperPanel')}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body transition-all relative ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground font-semibold shadow-md'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === 'alerts' && alertCount > 0 && (
                <span className="absolute right-3 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold">
                  {alertCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-2">
          <div className="px-4 py-2">
            <LanguageSwitcher compact />
          </div>
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${isOffline ? 'pastel-peach-bg text-foreground' : 'text-muted-foreground hover:bg-muted'}`}
          >
            {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
            {isOffline ? t('nav.offlineMode') : t('nav.online')}
          </button>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-all">
            <LogOut className="w-4 h-4" />
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      <main className="flex-1 min-h-screen">
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-muted transition-all">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="font-display font-bold text-lg text-foreground">{tabs.find(t => t.id === activeTab)?.label}</h1>
              <p className="text-xs text-muted-foreground">{t('nav.welcome')}, {user?.name} 👋</p>
            </div>
          </div>
          {isOffline && (
            <div className="px-3 py-1.5 rounded-full pastel-peach-bg flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5 text-foreground" />
              <span className="text-xs font-display font-semibold text-foreground">{t('nav.offline')}</span>
            </div>
          )}
        </header>

        <div className="p-4 lg:p-6">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {renderContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ShopkeeperLayout;

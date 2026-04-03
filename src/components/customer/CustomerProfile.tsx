import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { LogOut, Globe } from 'lucide-react';

const CustomerProfile = () => {
  const { user, logout } = useAuth();
  const { transactions } = useStore();
  const { t } = useLanguage();

  const myTransactions = transactions.filter(tx => tx.userId === user?.id || tx.customerName === user?.name);

  return (
    <div className="space-y-4">
      <div className="glass-card p-6 text-center">
        <div className="w-20 h-20 rounded-full gradient-pink mx-auto flex items-center justify-center text-3xl mb-3">
          {user?.name?.charAt(0).toUpperCase() || '?'}
        </div>
        <h2 className="font-display text-xl font-bold text-foreground">{user?.name}</h2>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
        <div className="mt-3 inline-flex px-3 py-1 rounded-full pastel-sky-bg text-xs font-display font-semibold text-foreground">
          {t('auth.customer')}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-display font-bold text-foreground">{myTransactions.length}</p>
          <p className="text-xs text-muted-foreground">{t('prof.orders')}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-display font-bold text-foreground">₹{myTransactions.reduce((s, tx) => s + tx.totalAmount, 0).toFixed(0)}</p>
          <p className="text-xs text-muted-foreground">{t('prof.totalSpent')}</p>
        </div>
      </div>

      <div>
        <h3 className="font-display font-bold text-foreground mb-3">{t('prof.orderHistory')}</h3>
        {myTransactions.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-6">{t('prof.noOrders')}</p>
        ) : (
          <div className="space-y-2">
            {myTransactions.map(tx => (
              <div key={tx.id} className="glass-card p-3">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-foreground">{new Date(tx.date).toLocaleDateString('en-IN')}</span>
                  <span className="font-display font-bold text-foreground">₹{tx.totalAmount.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{tx.items.map(i => i.productName).join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground font-semibold">{t('prof.language')}</span>
          </div>
          <LanguageSwitcher />
        </div>
        <button onClick={logout} className="w-full glass-card p-4 flex items-center gap-3 text-destructive hover:bg-destructive/5 transition-all">
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-semibold">{t('nav.logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerProfile;

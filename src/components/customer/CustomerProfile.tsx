import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import { motion } from 'framer-motion';
import { LogOut, User, ShoppingBag, MapPin, Phone, Globe } from 'lucide-react';

const CustomerProfile = () => {
  const { user, logout } = useAuth();
  const { transactions } = useStore();

  const myTransactions = transactions.filter(t => t.userId === user?.id || t.customerName === user?.name);

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <div className="glass-card p-6 text-center">
        <div className="w-20 h-20 rounded-full gradient-pink mx-auto flex items-center justify-center text-3xl mb-3">
          {user?.name?.charAt(0).toUpperCase() || '?'}
        </div>
        <h2 className="font-display text-xl font-bold text-foreground">{user?.name}</h2>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
        <div className="mt-3 inline-flex px-3 py-1 rounded-full pastel-sky-bg text-xs font-display font-semibold text-foreground">
          Customer / ग्राहक
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-display font-bold text-foreground">{myTransactions.length}</p>
          <p className="text-xs text-muted-foreground">Orders</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-display font-bold text-foreground">
            ₹{myTransactions.reduce((s, t) => s + t.totalAmount, 0).toFixed(0)}
          </p>
          <p className="text-xs text-muted-foreground">Total Spent</p>
        </div>
      </div>

      {/* Order History */}
      <div>
        <h3 className="font-display font-bold text-foreground mb-3">Order History</h3>
        {myTransactions.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-6">No orders yet</p>
        ) : (
          <div className="space-y-2">
            {myTransactions.map(t => (
              <div key={t.id} className="glass-card p-3">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-foreground">{new Date(t.date).toLocaleDateString('en-IN')}</span>
                  <span className="font-display font-bold text-foreground">₹{t.totalAmount.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t.items.map(i => i.productName).join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="space-y-2">
        <div className="glass-card p-4 flex items-center gap-3 text-muted-foreground">
          <Globe className="w-4 h-4" />
          <span className="text-sm text-foreground">Language: English / हिंदी</span>
        </div>
        <button
          onClick={logout}
          className="w-full glass-card p-4 flex items-center gap-3 text-destructive hover:bg-destructive/5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerProfile;

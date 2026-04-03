import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, TrendingUp, Zap } from 'lucide-react';

const CustomerHome = ({ onNavigate }: { onNavigate: (tab: 'search' | 'cart') => void }) => {
  const { user } = useAuth();
  const { products, addToCart } = useStore();

  const popular = [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 6);
  const deals = products.filter(p => p.quantity > 20).slice(0, 4);

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="gradient-hero rounded-2xl p-5">
        <p className="text-sm text-foreground/70">Namaste! 🙏</p>
        <h1 className="font-display text-2xl font-bold text-foreground">{user?.name || 'Welcome'}</h1>
        <p className="text-sm text-muted-foreground mt-1">Find everything you need</p>
        <button
          onClick={() => onNavigate('search')}
          className="mt-3 w-full py-2.5 rounded-xl bg-card/80 backdrop-blur text-sm text-muted-foreground text-left px-4 border border-border"
        >
          🔍 Search products...
        </button>
      </div>

      {/* Categories */}
      <div>
        <h2 className="font-display font-bold text-foreground mb-3">Categories</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {['Grains', 'Dairy', 'Snacks', 'Pulses', 'Essentials', 'Household'].map((cat, i) => {
            const bgs = ['pastel-pink-bg', 'pastel-lavender-bg', 'pastel-mint-bg', 'pastel-sky-bg', 'pastel-peach-bg', 'pastel-yellow-bg'];
            const emojis = ['🌾', '🥛', '🍪', '🫘', '🧂', '🧹'];
            return (
              <button key={cat} onClick={() => onNavigate('search')} className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-5 py-3 rounded-2xl ${bgs[i]} transition-all hover:opacity-80`}>
                <span className="text-2xl">{emojis[i]}</span>
                <span className="text-xs font-display font-semibold text-foreground whitespace-nowrap">{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular Products */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h2 className="font-display font-bold text-foreground">Popular Items</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {popular.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card-hover p-4"
            >
              <div className="w-full h-16 rounded-xl pastel-lavender-bg flex items-center justify-center text-2xl mb-3">
                {['🌾', '🫘', '🧈', '🍪', '🧂', '🧹', '🍜', '🌾', '🍅', '🥜'][i] || '📦'}
              </div>
              <h3 className="font-display font-semibold text-sm text-foreground leading-tight">{p.name}</h3>
              {p.nameHi && <p className="text-[10px] text-muted-foreground">{p.nameHi}</p>}
              <div className="flex items-center justify-between mt-2">
                <p className="font-display font-bold text-foreground">₹{p.price}</p>
                <button
                  onClick={() => { addToCart(p); }}
                  disabled={p.quantity === 0}
                  className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold disabled:opacity-40"
                >
                  +
                </button>
              </div>
              {p.quantity === 0 && <p className="text-[10px] text-destructive mt-1">Out of stock</p>}
              {p.quantity > 0 && p.quantity <= 5 && <p className="text-[10px] text-destructive mt-1">Only {p.quantity} left!</p>}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="font-display font-bold text-foreground">You May Also Like</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {deals.map(p => (
            <div key={p.id} className="flex-shrink-0 w-36 glass-card p-3">
              <p className="font-display font-semibold text-sm text-foreground">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.category}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-display font-bold text-sm text-foreground">₹{p.price}</span>
                <button onClick={() => addToCart(p)} className="text-xs px-2 py-1 rounded-lg bg-primary text-primary-foreground font-semibold">Add</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;

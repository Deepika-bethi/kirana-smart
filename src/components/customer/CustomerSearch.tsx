import React, { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const CustomerSearch = () => {
  const { products, addToCart } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');

  const categories = ['All', ...new Set(products.map(p => p.category))];

  let filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.nameHi && p.nameHi.includes(search));
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl font-bold text-foreground">Search Products</h1>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search... (खोजें)"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm outline-none focus:border-primary text-foreground"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-display font-semibold transition-all ${
              category === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {(['name', 'price-low', 'price-high'] as const).map(s => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-display transition-all ${sortBy === s ? 'pastel-lavender-bg font-semibold text-foreground' : 'text-muted-foreground'}`}
          >
            {s === 'name' ? 'A-Z' : s === 'price-low' ? 'Price ↑' : 'Price ↓'}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-3">
        {filtered.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="glass-card-hover p-4 flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-xl pastel-mint-bg flex items-center justify-center text-xl flex-shrink-0">📦</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-sm text-foreground">{p.name}</h3>
              {p.nameHi && <p className="text-[10px] text-muted-foreground">{p.nameHi}</p>}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{p.category}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${p.quantity > 0 ? 'pastel-mint-bg text-foreground' : 'pastel-peach-bg text-foreground'}`}>
                  {p.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-display font-bold text-foreground">₹{p.price}</p>
              <button
                onClick={() => { addToCart(p); toast.success(`${p.name} added to cart`); }}
                disabled={p.quantity === 0}
                className="mt-1 px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-display font-semibold disabled:opacity-40"
              >
                Add
              </button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No products found</p>
        )}
      </div>
    </div>
  );
};

export default CustomerSearch;
